"""Thin Google Gemini chat client (supports GEMINI_API_KEY)."""

from __future__ import annotations

import json
import os
from typing import Any

from curl_cffi import requests

DEFAULT_MODEL = "gemini-3.5-flash-lite"
FALLBACK_MODELS = ("gemini-3.1-flash-lite", "gemini-flash-latest")


class GeminiError(RuntimeError):
    pass


def has_key() -> bool:
    return bool(os.environ.get("GEMINI_API_KEY"))


def chat_json(
    system_prompt: str,
    user_prompt: str,
    *,
    model: str = DEFAULT_MODEL,
    temperature: float = 0.2,
    timeout: int = 60,
) -> dict[str, Any]:
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        raise GeminiError(
            "GEMINI_API_KEY não definida no ambiente"
        )

    models_to_try = [model] + [m for m in FALLBACK_MODELS if m != model]
    last_err = None

    for m in models_to_try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={key}"
        payload = {
            "systemInstruction": {"parts": [{"text": system_prompt}]},
            "contents": [{"parts": [{"text": user_prompt}]}],
            "generationConfig": {
                "responseMimeType": "application/json",
                "temperature": temperature,
            },
        }

        try:
            r = requests.post(
                url,
                headers={"Content-Type": "application/json"},
                json=payload,
                timeout=timeout,
            )
        except Exception as e:  # noqa: BLE001
            last_err = f"falha de rede: {e}"
            continue

        if r.status_code != 200:
            last_err = f"HTTP {r.status_code}: {r.text[:300]}"
            continue

        try:
            body = r.json()
            content = body["candidates"][0]["content"]["parts"][0]["text"]
            usage = body.get("usageMetadata") or {}
        except (KeyError, IndexError, ValueError) as e:
            last_err = f"resposta inesperada da API: {r.text[:300]}"
            continue

        try:
            data = json.loads(content)
        except json.JSONDecodeError as e:
            last_err = f"modelo não devolveu JSON válido: {content[:300]}"
            continue

        return {
            "data": data,
            "raw": content,
            "prompt_tokens": usage.get("promptTokenCount"),
            "completion_tokens": usage.get("candidatesTokenCount"),
            "model": m,
        }

    raise GeminiError(last_err or "falha ao contatar Gemini")
