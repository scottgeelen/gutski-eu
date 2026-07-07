"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LogoMark, { LogoDefs } from "@/components/Logo";

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

  return (
    <main className="adm-login">
      <LogoDefs />
      <form className="adm-login-card" onSubmit={onSubmit}>
        <span className="adm-login-brand">
          <LogoMark />
        </span>
        <h1>GUTSKI <span>Admin</span></h1>
        <p className="sub">Log in om verkooppunten en aanmeldingen te beheren.</p>
        <input
          type="email"
          placeholder="E-mailadres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && <p className="adm-err" style={{ fontSize: ".85rem" }}>{error}</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? "Bezig…" : "Inloggen"}</button>
      </form>
    </main>
  );
}
