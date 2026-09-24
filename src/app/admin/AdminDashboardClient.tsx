"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LogOut, Phone, RefreshCw, ShieldAlert, XCircle } from "lucide-react";
import type { Reservation, ReservationStatus } from "@/lib/reservationTypes";
import { formatDateFrLong } from "@/lib/format";
import { formatDH } from "@/lib/pricing";
import { getExtraById } from "@/data/extras";
import { getPackById } from "@/data/packs";
import { cn } from "@/lib/cn";

type Tab = "pending" | "confirmed" | "rejected" | "all";

const TABS: { id: Tab; label: string }[] = [
  { id: "pending", label: "En attente de vérification" },
  { id: "confirmed", label: "Confirmées" },
  { id: "rejected", label: "Refusées / libérées" },
  { id: "all", label: "Toutes" },
];

export default function AdminDashboardClient() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("pending");
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reservations", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur de chargement.");
      setReservations(data.reservations ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setStatus(id: string, status: ReservationStatus) {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Action impossible.");
      setReservations((prev) => prev.map((r) => (r.id === id ? data.reservation : r)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action impossible.");
    } finally {
      setMutatingId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const counts = useMemo(() => {
    return {
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      rejected: reservations.filter((r) => r.status === "rejected").length,
      all: reservations.length,
    };
  }, [reservations]);

  const filtered = tab === "all" ? reservations : reservations.filter((r) => r.status === tab);

  return (
    <div className="container-edge py-10 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-paper">Réservations</h1>
          <p className="text-sm text-paper/50 mt-1">
            Vérifiez chaque demande par téléphone avant de la confirmer.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-full border border-paper/15 px-3.5 py-2 text-xs text-paper/70 hover:border-gold hover:text-gold-light"
          >
            <RefreshCw size={13} /> Actualiser
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-full border border-paper/15 px-3.5 py-2 text-xs text-paper/70 hover:border-clay hover:text-clay-light"
          >
            <LogOut size={13} /> Déconnexion
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
              tab === t.id
                ? "border-gold bg-gold/10 text-gold-light"
                : "border-paper/15 text-paper/60 hover:border-paper/30"
            )}
          >
            {t.label} <span className="text-paper/40">({counts[t.id]})</span>
          </button>
        ))}
      </div>

      {loading && <p className="text-paper/50">Chargement…</p>}
      {error && (
        <div className="rounded-2xl border border-clay/30 bg-clay/10 p-5 text-sm text-clay-light">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-paper/10 bg-ink-soft p-14 text-center text-paper/50">
          Aucune réservation ici pour le moment.
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((r) => (
          <ReservationRow
            key={r.id}
            reservation={r}
            busy={mutatingId === r.id}
            onConfirm={() => setStatus(r.id, "confirmed")}
            onReject={() => setStatus(r.id, "rejected")}
            onReopen={() => setStatus(r.id, "pending")}
          />
        ))}
      </div>
    </div>
  );
}

function ReservationRow({
  reservation,
  busy,
  onConfirm,
  onReject,
  onReopen,
}: {
  reservation: Reservation;
  busy: boolean;
  onConfirm: () => void;
  onReject: () => void;
  onReopen: () => void;
}) {
  const r = reservation;
  const pack = r.packId ? getPackById(r.packId) : undefined;
  const extraNames = r.extras.map((id) => getExtraById(id)?.name).filter(Boolean);

  return (
    <div className="rounded-2xl border border-paper/10 bg-ink-soft p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-display text-lg text-paper">{r.customerName}</p>
            <StatusBadge status={r.status} />
          </div>
          <a
            href={`tel:${r.customerPhone.replace(/\s+/g, "")}`}
            className="mt-1 flex items-center gap-1.5 text-sm text-gold-light hover:underline w-fit"
          >
            <Phone size={13} /> {r.customerPhone}
          </a>
        </div>
        <div className="text-right">
          <p className="font-display text-xl text-gold-light">{formatDH(r.total)}</p>
          <p className="text-xs text-paper/40">
            Demande envoyée le {formatDateFrLong(r.createdAt.slice(0, 10))}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
        <div>
          <p className="text-paper/40 text-xs uppercase tracking-wider mb-1">Véhicule & dates</p>
          <p className="text-paper/80">{r.vehicleName}</p>
          <p className="text-paper/50 text-xs">
            {formatDateFrLong(r.startDate)} → {formatDateFrLong(r.endDate)}
          </p>
        </div>
        <div>
          <p className="text-paper/40 text-xs uppercase tracking-wider mb-1">Options</p>
          <p className="text-paper/60 text-xs">
            {[pack?.name, ...extraNames].filter(Boolean).join(", ") || "Aucune"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {r.status !== "confirmed" && (
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink hover:brightness-110 disabled:opacity-50"
          >
            <CheckCircle2 size={14} /> Client vérifié — Valider
          </button>
        )}
        {r.status !== "rejected" && (
          <button
            onClick={onReject}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-full border border-clay/40 px-4 py-2 text-xs font-medium text-clay-light hover:bg-clay/10 disabled:opacity-50"
          >
            <ShieldAlert size={14} /> Arnaque — Libérer le véhicule
          </button>
        )}
        {r.status !== "pending" && (
          <button
            onClick={onReopen}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-full border border-paper/15 px-4 py-2 text-xs text-paper/60 hover:border-paper/30 disabled:opacity-50"
          >
            <XCircle size={14} /> Remettre en attente
          </button>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const config = {
    pending: { label: "En attente de vérification", cls: "bg-gold/15 text-gold-light" },
    confirmed: { label: "Confirmée", cls: "bg-emerald-500/15 text-emerald-300" },
    rejected: { label: "Refusée / libérée", cls: "bg-clay/20 text-clay-light" },
  }[status];

  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", config.cls)}>
      {config.label}
    </span>
  );
}
