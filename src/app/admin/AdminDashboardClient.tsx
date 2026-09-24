"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Ban,
  CalendarDays,
  Car,
  CheckCircle2,
  LogOut,
  MapPin,
  Phone,
  Plane,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  StickyNote,
} from "lucide-react";
import { DAILY_RESERVATION_LIMIT, shortReservationRef, type AdminReservation, type ReservationStatus } from "@/lib/reservationTypes";
import { formatDateFrLong, LOCATION_LABELS } from "@/lib/format";
import { formatDH } from "@/lib/pricing";
import { getExtraById } from "@/data/extras";
import { getPackById } from "@/data/packs";
import { cn } from "@/lib/cn";

type Tab = "pending" | "confirmed" | "rejected" | "all";

const TABS: { id: Tab; label: string }[] = [
  { id: "pending", label: "À vérifier" },
  { id: "confirmed", label: "Confirmées" },
  { id: "rejected", label: "Refusées / libérées" },
  { id: "all", label: "Toutes" },
];

const REFRESH_INTERVAL_MS = 30_000;

export default function AdminDashboardClient() {
  const router = useRouter();
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("pending");
  const [query, setQuery] = useState("");
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  async function load(silent = false) {
    if (!silent) setLoading(true);
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
    const timer = setInterval(() => load(true), REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setStatus(id: string, status: ReservationStatus, adminNote: string) {
    setMutatingId(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Action impossible.");
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...data.reservation, phoneTodayCount: r.phoneTodayCount } : r))
      );
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

  const counts = useMemo(
    () => ({
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      rejected: reservations.filter((r) => r.status === "rejected").length,
      all: reservations.length,
    }),
    [reservations]
  );

  const blockedPhones = useMemo(
    () =>
      new Set(reservations.filter((r) => r.phoneTodayCount >= DAILY_RESERVATION_LIMIT).map((r) => r.customerPhone))
        .size,
    [reservations]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, "");
    return reservations.filter((r) => {
      if (tab !== "all" && r.status !== tab) return false;
      if (!q) return true;
      return [r.customerName, r.customerPhone, r.vehicleName, r.id].some((field) =>
        field.toLowerCase().replace(/\s+/g, "").includes(q)
      );
    });
  }, [reservations, tab, query]);

  return (
    <div className="container-edge py-10 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-paper">Réservations</h1>
          <p className="text-sm text-paper/50 mt-1">
            Appelez chaque client pour vérifier sa demande avant de la valider.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => load()}
            className="flex items-center gap-1.5 rounded-full border border-paper/15 px-3.5 py-2 text-xs text-paper/70 hover:border-gold hover:text-gold-light"
          >
            <RefreshCw size={13} className={cn(loading && "animate-spin")} /> Actualiser
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-full border border-paper/15 px-3.5 py-2 text-xs text-paper/70 hover:border-clay hover:text-clay-light"
          >
            <LogOut size={13} /> Déconnexion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 mb-8">
        <Stat label="À vérifier" value={counts.pending} accent="text-gold-light" />
        <Stat label="Confirmées" value={counts.confirmed} accent="text-emerald-300" />
        <Stat label="Refusées / libérées" value={counts.rejected} accent="text-clay-light" />
        <Stat
          label={`Numéros bloqués aujourd'hui (${DAILY_RESERVATION_LIMIT}+ demandes)`}
          value={blockedPhones}
          accent={blockedPhones > 0 ? "text-clay-light" : "text-paper/70"}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
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
        <label className="flex w-full items-center gap-2 rounded-full border border-paper/15 bg-ink px-4 py-2 sm:w-72 focus-within:border-gold">
          <Search size={14} className="text-paper/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom, téléphone, véhicule…"
            className="w-full bg-transparent text-sm text-paper placeholder:text-paper/35 outline-none"
          />
        </label>
      </div>

      {loading && reservations.length === 0 && <p className="text-paper/50">Chargement…</p>}
      {error && (
        <div className="mb-4 rounded-2xl border border-clay/30 bg-clay/10 p-5 text-sm text-clay-light">{error}</div>
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
            onSetStatus={(status, note) => setStatus(r.id, status, note)}
          />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl border border-paper/10 bg-ink-soft p-4">
      <p className={cn("font-display text-3xl", accent)}>{value}</p>
      <p className="mt-1 text-xs text-paper/45">{label}</p>
    </div>
  );
}

function locationLabel(option: string, custom: string | null) {
  if ((option === "hotel" || option === "adresse") && custom) return custom;
  return LOCATION_LABELS[option] ?? option;
}

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Casablanca",
  }).format(new Date(iso));
}

function ReservationRow({
  reservation,
  busy,
  onSetStatus,
}: {
  reservation: AdminReservation;
  busy: boolean;
  onSetStatus: (status: ReservationStatus, note: string) => void;
}) {
  const r = reservation;
  const [note, setNote] = useState(r.adminNote ?? "");
  const pack = r.packId ? getPackById(r.packId) : undefined;
  const extraNames = r.extras.map((id) => getExtraById(id)?.name).filter(Boolean);
  const isBlockedPhone = r.phoneTodayCount >= DAILY_RESERVATION_LIMIT;
  const isSuspicious = r.phoneTodayCount > 1;

  return (
    <div
      className={cn(
        "rounded-2xl border bg-ink-soft p-5",
        r.status === "pending" ? "border-gold/25" : "border-paper/10"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-lg text-paper">{r.customerName}</p>
            <StatusBadge status={r.status} />
            {isSuspicious && (
              <span
                className={cn(
                  "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
                  isBlockedPhone ? "bg-clay/25 text-clay-light" : "bg-paper/10 text-paper/70"
                )}
              >
                {isBlockedPhone ? <Ban size={11} /> : <ShieldAlert size={11} />}
                {r.phoneTodayCount} demandes aujourd&rsquo;hui{isBlockedPhone && " — numéro bloqué"}
              </span>
            )}
          </div>
          <a
            href={`tel:${r.customerPhone}`}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/30 px-4 py-2 text-sm font-medium text-gold-light hover:bg-gold/20"
          >
            <Phone size={14} /> Appeler {r.customerPhone}
          </a>
        </div>
        <div className="text-right">
          <p className="font-display text-xl text-gold-light">{formatDH(r.total)}</p>
          <p className="text-xs text-paper/40">Reçue le {formatDateTime(r.createdAt)}</p>
          <p className="text-[11px] text-paper/30 mt-0.5">Réf. {shortReservationRef(r.id)}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <Detail icon={Car} label="Véhicule">
          <p className="text-paper/80">{r.vehicleName}</p>
        </Detail>
        <Detail icon={CalendarDays} label="Dates">
          <p className="text-paper/80">
            {formatDateFrLong(r.startDate)}
            <br />
            <span className="text-paper/50">au</span> {formatDateFrLong(r.endDate)}
          </p>
        </Detail>
        <Detail icon={MapPin} label="Prise / retour">
          <p className="text-paper/80">{locationLabel(r.pickupLocation, r.pickupCustom)}</p>
          <p className="text-paper/50 text-xs">Retour : {locationLabel(r.dropoffLocation, r.dropoffCustom)}</p>
          {r.flightInfo?.flightNumber && (
            <p className="mt-1 flex items-center gap-1 text-xs text-paper/60">
              <Plane size={11} /> Vol {r.flightInfo.flightNumber}
              {r.flightInfo.arrivalTime && ` · ${r.flightInfo.arrivalTime}`}
            </p>
          )}
        </Detail>
        <Detail icon={Sparkles} label="Options">
          <p className="text-paper/60 text-xs">
            {[pack?.name, ...extraNames].filter(Boolean).join(", ") || "Aucune"}
          </p>
          {r.carPrep && <p className="mt-1 text-xs text-paper/60">Préparation « {r.carPrep.occasion} »{r.carPrep.options.length > 0 && ` (${r.carPrep.options.length} options)`}</p>}
        </Detail>
      </div>

      <label className="mt-5 flex items-start gap-2 rounded-xl border border-paper/10 bg-ink px-3.5 py-2.5 focus-within:border-gold">
        <StickyNote size={14} className="mt-0.5 shrink-0 text-paper/35" />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={1}
          placeholder="Note interne après l'appel (ex. : client joint, pièce d'identité vérifiée…)"
          className="w-full resize-y bg-transparent text-sm text-paper placeholder:text-paper/30 outline-none"
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {r.status !== "confirmed" && (
          <button
            onClick={() => onSetStatus("confirmed", note)}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink hover:brightness-110 disabled:opacity-50"
          >
            <CheckCircle2 size={14} /> Client vérifié — Valider
          </button>
        )}
        {r.status !== "rejected" && (
          <button
            onClick={() => onSetStatus("rejected", note)}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-full border border-clay/40 px-4 py-2 text-xs font-medium text-clay-light hover:bg-clay/10 disabled:opacity-50"
          >
            <ShieldAlert size={14} /> Arnaque — Remettre le véhicule disponible
          </button>
        )}
        {r.status !== "pending" && (
          <button
            onClick={() => onSetStatus("pending", note)}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-full border border-paper/15 px-4 py-2 text-xs text-paper/60 hover:border-paper/30 disabled:opacity-50"
          >
            <RotateCcw size={14} /> Remettre en attente
          </button>
        )}
        {note !== (r.adminNote ?? "") && (
          <button
            onClick={() => onSetStatus(r.status, note)}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-full border border-paper/15 px-4 py-2 text-xs text-paper/70 hover:border-gold hover:text-gold-light disabled:opacity-50"
          >
            <StickyNote size={14} /> Enregistrer la note
          </button>
        )}
      </div>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Car;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-paper/40">
        <Icon size={12} /> {label}
      </p>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const config = {
    pending: { label: "En attente de vérification", cls: "bg-gold/15 text-gold-light" },
    confirmed: { label: "Confirmée", cls: "bg-emerald-500/15 text-emerald-300" },
    rejected: { label: "Refusée — véhicule libéré", cls: "bg-clay/20 text-clay-light" },
  }[status];

  return <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium", config.cls)}>{config.label}</span>;
}
