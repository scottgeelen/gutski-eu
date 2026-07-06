"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setError("Inloggen mislukt. Controleer e-mail en wachtwoord.");
    router.push("/admin");
    router.refresh();
  }

  const input = {
    background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 12,
    color: "var(--ice)", padding: "13px 16px", font: "inherit", width: "100%",
  } as const;

  return (
    <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: 20 }}>
      <form onSubmit={onSubmit} style={{ width: "min(380px,100%)", display: "grid", gap: 14, background: "var(--slope)", border: "1px solid var(--line)", borderRadius: 18, padding: 32 }}>
        <h1 style={{ fontFamily: "var(--font-syne),sans-serif", fontSize: "1.4rem", textTransform: "uppercase" }}>
          GUTSKI <span style={{ color: "var(--glacier)" }}>Admin</span>
        </h1>
        <input style={input} type="email" placeholder="E-mailadres" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <input style={input} type="password" placeholder="Wachtwoord" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        {error && <p style={{ color: "#E58", fontSize: ".85rem" }}>{error}</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? "Bezig…" : "Inloggen"}</button>
      </form>
    </main>
  );
}
