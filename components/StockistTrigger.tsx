"use client";

/** Knop die (waar dan ook op de pagina) de gedeelde "Word verkooppunt"-modal
 *  opent via een custom event. */
export default function StockistTrigger({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`linklike ${className}`.trim()}
      onClick={() => window.dispatchEvent(new Event("gutski:stockist-open"))}
    >
      {children}
    </button>
  );
}
