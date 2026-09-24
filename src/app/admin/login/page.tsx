"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Connexion impossible.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Connexion impossible. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-edge flex min-h-[70vh] items-center justify-center py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-paper/10 bg-ink-soft p-8"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold-light">
            <Lock size={20} />
          </span>
          <h1 className="mt-4 font-display text-2xl text-paper">Espace administrateur</h1>
          <p className="mt-1 text-sm text-paper/50">Atlas Drive — Gestion des réservations</p>
        </div>

        <label className="mb-2 block text-xs uppercase tracking-wider text-paper/40" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-xl border border-paper/15 bg-ink px-4 py-3 text-sm text-paper outline-none focus:border-gold"
        />

        {error && <p className="mt-3 text-sm text-clay-light">{error}</p>}

        <Button type="submit" disabled={loading || !password} className="mt-6 w-full" size="lg">
          {loading ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
