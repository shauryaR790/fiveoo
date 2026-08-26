type NeonFogProps = {
  className?: string;
  /** hero = lower bank only. loader = hero fog shifted down for intro. continuous = Hero → About. partners = logo → heading handoff. footer = soft bottom glow. */
  variant?: "hero" | "loader" | "continuous" | "footer" | "partners";
};

function NeonFogBlobs() {
  return (
    <>
      <div className="absolute bottom-[-20%] left-[-15%] h-[90%] w-[55%] rounded-full bg-[var(--color-neon-purple)] opacity-50 blur-[100px] md:blur-[140px]" />
      <div className="absolute bottom-[-25%] right-[-10%] h-[95%] w-[60%] rounded-full bg-[var(--color-neon-orange)] opacity-45 blur-[110px] md:blur-[150px]" />
      <div className="absolute bottom-[5%] left-[30%] h-[50%] w-[40%] rounded-full bg-[var(--color-neon-amber)] opacity-30 blur-[80px]" />
    </>
  );
}

function NeonFogBlobsFooter() {
  return (
    <>
      <div className="absolute bottom-[12%] left-[-12%] h-[72%] w-[50%] rounded-full bg-[var(--color-neon-purple)] opacity-45 blur-[90px] md:blur-[120px]" />
      <div className="absolute bottom-[10%] right-[-8%] h-[74%] w-[54%] rounded-full bg-[var(--color-neon-orange)] opacity-40 blur-[95px] md:blur-[125px]" />
      <div className="absolute bottom-[22%] left-[30%] h-[40%] w-[36%] rounded-full bg-[var(--color-neon-amber)] opacity-28 blur-[70px]" />
    </>
  );
}

function NeonFogBlobsPartners() {
  return (
    <>
      <div className="absolute bottom-[-32%] left-[-16%] h-[105%] w-[58%] rounded-full bg-[var(--color-neon-purple)] opacity-65 blur-[110px] md:blur-[150px]" />
      <div className="absolute bottom-[-36%] right-[-12%] h-[110%] w-[64%] rounded-full bg-[var(--color-neon-orange)] opacity-60 blur-[115px] md:blur-[160px]" />
      <div className="absolute bottom-[-8%] left-[24%] h-[62%] w-[44%] rounded-full bg-[var(--color-neon-amber)] opacity-45 blur-[85px] md:blur-[100px]" />
    </>
  );
}

/**
 * Original Hero fog - soft blobs only.
 * Never clip with overflow:hidden (that cuts a hard line across the page).
 */
export default function NeonFog({
  className = "",
  variant = "hero",
}: NeonFogProps) {
  if (variant === "loader") {
    return (
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-[-10%] z-0 h-[46%] ${className}`}
        aria-hidden
      >
        <NeonFogBlobs />
      </div>
    );
  }

  if (variant === "continuous") {
    return (
      <div
        className={`pointer-events-none absolute inset-x-0 top-[45vh] bottom-0 z-0 ${className}`}
        aria-hidden
      >
        <NeonFogBlobs />
        {/* Soft handoff into plain black before Selected Works */}
        <div className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-b from-transparent to-[var(--color-bg)]" />
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[68%] ${className}`}
        aria-hidden
      >
        <NeonFogBlobsFooter />
      </div>
    );
  }

  if (variant === "partners") {
    return (
      <div
        className={`pointer-events-none absolute inset-0 z-0 ${className}`}
        aria-hidden
      >
        <NeonFogBlobsPartners />
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[55%] ${className}`}
      aria-hidden
    >
      <NeonFogBlobs />
    </div>
  );
}
