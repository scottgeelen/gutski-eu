"use client";
import { useState } from "react";

export default function AdminTabs({
  tabs,
  children,
}: {
  tabs: { label: string; badge?: number }[];
  children: React.ReactNode[];
}) {
  const [active, setActive] = useState(0);
  const panels = Array.isArray(children) ? children : [children];

  return (
    <>
      <div className="adm-tabs" role="tablist" aria-label="Beheersecties">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={active === i}
            className={`adm-tab${active === i ? " on" : ""}`}
            onClick={() => setActive(i)}
          >
            {t.label}
            {typeof t.badge === "number" && <span className="adm-badge">{t.badge}</span>}
          </button>
        ))}
      </div>
      {panels.map((panel, i) => (
        <div key={i} role="tabpanel" hidden={active !== i}>
          {panel}
        </div>
      ))}
    </>
  );
}
