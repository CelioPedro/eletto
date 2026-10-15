import Link from "next/link";

type LogoProps = {
  size?: "sm" | "default" | "lg";
  href?: string;
  className?: string;
  showTagline?: boolean;
  iconOnly?: boolean;
};

export function ElettoLogo({
  size = "default",
  href = "/",
  className = "",
  showTagline = false,
  iconOnly = false,
}: LogoProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const iconSize = isSm ? 20 : isLg ? 28 : 24;
  const textSize = isSm ? "text-[14px]" : isLg ? "text-[20px]" : "text-[16.5px]";
  const aiSize = isSm ? "text-[8px] -top-1" : isLg ? "text-[11px] -top-2" : "text-[9px] -top-1.5";

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Símbolo Isométrico Eletto AI (Padrão Indicium) */}
      <span className="relative flex-none flex items-center justify-center text-[#1D63FF] transition-transform duration-200 group-hover:scale-105">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Contorno Hexagonal Isométrico com Canto Vivo / Técnico */}
          <path
            d="M12 2.5L20.5 7.4V17.1L12 22L3.5 17.1V7.4L12 2.5Z"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arestas Centrais Tridimensionais */}
          <path
            d="M12 12.3V2.5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 12.3L20.5 17.1"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 12.3L3.5 17.1"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Faceta Superior com Reflexo Ciano Técnico */}
          <path
            d="M12 2.5L20.5 7.4L12 12.3L3.5 7.4L12 2.5Z"
            fill="#1D63FF"
            fillOpacity="0.12"
          />
          {/* Ponto Central de Nexus */}
          <circle cx="12" cy="12.3" r="1.3" fill="#5CE1E6" />
        </svg>
      </span>

      {/* Logotipo eletto com expoente AI */}
      {!iconOnly ? (
        <div className="flex flex-col justify-center">
          <div className="flex items-baseline leading-none">
            <span className={`font-sans font-semibold tracking-[-0.03em] text-[var(--fg-1)] ${textSize}`}>
              eletto
            </span>
            <span
              className={`font-mono font-bold text-[#1D63FF] tracking-tight relative ml-0.5 ${aiSize}`}
              style={{ fontFeatureSettings: '"tnum"' }}
            >
              AI
            </span>
          </div>
          {showTagline ? (
            <span className="text-[10px] text-[var(--muted-2)] font-mono font-medium leading-tight mt-0.5">
              inteligência eleitoral
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center" style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  }

  return content;
}
