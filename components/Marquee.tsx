export default function Marquee({ items }: { items: string[] }) {
  const seq = [...items, ...items, ...items];
  return (
    <div className="marquee-wrap" aria-hidden="true">
      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((half) => (
            <span key={half} style={{ display: "inline-flex", padding: 0 }}>
              {seq.map((w, i) => (
                <span key={i}>{w}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
