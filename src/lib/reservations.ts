import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabaseAdmin";
import type { Reservation, ReservationStatus, NewReservationInput } from "./reservationTypes";

export type { Reservation, ReservationStatus, NewReservationInput };

/** Thrown when a write would give a vehicle two active reservations on overlapping dates. */
export class ReservationConflictError extends Error {
  constructor() {
    super("Ce véhicule est déjà réservé sur ces dates.");
  }
}

const ACTIVE_STATUSES: ReservationStatus[] = ["pending", "confirmed"];

function isActive(status: ReservationStatus) {
  return ACTIVE_STATUSES.includes(status);
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

/** Start of the current day in Morocco, as a UTC ISO string. */
export function startOfTodayInCasablanca(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Casablanca",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const localAsUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  const offsetMs = localAsUtc - Math.floor(now.getTime() / 1000) * 1000;
  const localMidnightAsUtc = Date.UTC(get("year"), get("month") - 1, get("day"));
  return new Date(localMidnightAsUtc - offsetMs).toISOString();
}

/**
 * Canonical form used to count reservations per phone, so "06 11 22 33 44",
 * "+212 6 11 22 33 44" and "00212611223344" all count as the same number.
 */
export function normalizePhone(phone: string): string {
  let p = phone.trim().replace(/[\s().-]/g, "");
  if (p.startsWith("00")) p = `+${p.slice(2)}`;
  if (/^0\d{9}$/.test(p)) return `+212${p.slice(1)}`;
  if (/^212\d{9}$/.test(p)) return `+${p}`;
  // "+212 (0) 6…" written with the trunk zero kept
  if (/^\+2120\d{9}$/.test(p)) return `+212${p.slice(5)}`;
  return p;
}

interface ReservationStore {
  list(): Promise<Reservation[]>;
  get(id: string): Promise<Reservation | null>;
  insert(input: NewReservationInput): Promise<Reservation>;
  updateStatus(id: string, status: ReservationStatus, adminNote?: string | null): Promise<Reservation>;
  countSince(phone: string, sinceISO: string): Promise<number>;
  activeRanges(vehicleSlug?: string): Promise<{ vehicleSlug: string; startDate: string; endDate: string }[]>;
}

// ---------------------------------------------------------------------------
// Supabase (production)
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(row: any): Reservation {
  return {
    id: row.id,
    vehicleSlug: row.vehicle_slug,
    vehicleName: row.vehicle_name,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    startDate: row.start_date,
    endDate: row.end_date,
    pickupLocation: row.pickup_location,
    pickupCustom: row.pickup_custom,
    dropoffLocation: row.dropoff_location,
    dropoffCustom: row.dropoff_custom,
    extras: row.extras ?? [],
    packId: row.pack_id,
    carPrep: row.car_prep,
    flightInfo: row.flight_info,
    total: Number(row.total),
    status: row.status,
    adminNote: row.admin_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Postgres exclusion_violation, raised by the reservations_no_overlap constraint.
function throwMapped(error: { code?: string }): never {
  if (error.code === "23P01") throw new ReservationConflictError();
  throw error;
}

const supabaseStore: ReservationStore = {
  async list() {
    const { data, error } = await getSupabaseAdmin()
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throwMapped(error);
    return (data ?? []).map(mapRow);
  },

  async get(id) {
    const { data, error } = await getSupabaseAdmin().from("reservations").select("*").eq("id", id).maybeSingle();
    if (error) {
      // Malformed uuid: treat as not found rather than a server error.
      if (error.code === "22P02") return null;
      throwMapped(error);
    }
    return data ? mapRow(data) : null;
  },

  async insert(input) {
    const { data, error } = await getSupabaseAdmin()
      .from("reservations")
      .insert({
        vehicle_slug: input.vehicleSlug,
        vehicle_name: input.vehicleName,
        customer_name: input.customerName,
        customer_phone: input.customerPhone,
        start_date: input.startDate,
        end_date: input.endDate,
        pickup_location: input.pickupLocation,
        pickup_custom: input.pickupCustom ?? null,
        dropoff_location: input.dropoffLocation,
        dropoff_custom: input.dropoffCustom ?? null,
        extras: input.extras,
        pack_id: input.packId ?? null,
        car_prep: input.carPrep ?? null,
        flight_info: input.flightInfo ?? null,
        total: input.total,
        status: "pending",
      })
      .select()
      .single();
    if (error) throwMapped(error);
    return mapRow(data);
  },

  async updateStatus(id, status, adminNote) {
    const patch: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (adminNote !== undefined) patch.admin_note = adminNote;
    const { data, error } = await getSupabaseAdmin()
      .from("reservations")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) throwMapped(error);
    return mapRow(data);
  },

  async countSince(phone, sinceISO) {
    const { count, error } = await getSupabaseAdmin()
      .from("reservations")
      .select("id", { count: "exact", head: true })
      .eq("customer_phone", phone)
      .gte("created_at", sinceISO);
    if (error) throwMapped(error);
    return count ?? 0;
  },

  async activeRanges(vehicleSlug) {
    let query = getSupabaseAdmin()
      .from("reservations")
      .select("vehicle_slug, start_date, end_date")
      .in("status", ACTIVE_STATUSES);
    if (vehicleSlug) query = query.eq("vehicle_slug", vehicleSlug);
    const { data, error } = await query;
    if (error) throwMapped(error);
    return (data ?? []).map((row) => ({
      vehicleSlug: row.vehicle_slug as string,
      startDate: row.start_date as string,
      endDate: row.end_date as string,
    }));
  },
};

// ---------------------------------------------------------------------------
// Local JSON file (development without Supabase)
// ---------------------------------------------------------------------------

const FILE_PATH = path.join(process.cwd(), ".data", "reservations.json");
let fileLock: Promise<unknown> = Promise.resolve();

async function readFile(): Promise<Reservation[]> {
  try {
    return JSON.parse(await fs.readFile(FILE_PATH, "utf8"));
  } catch {
    return [];
  }
}

async function writeFile(rows: Reservation[]) {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(rows, null, 2));
}

/** Serialises read-modify-write cycles so concurrent requests can't double-book. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = fileLock.then(fn, fn);
  fileLock = run.catch(() => {});
  return run;
}

function hasOverlap(rows: Reservation[], candidate: Pick<Reservation, "id" | "vehicleSlug" | "startDate" | "endDate">) {
  return rows.some(
    (r) =>
      r.id !== candidate.id &&
      r.vehicleSlug === candidate.vehicleSlug &&
      isActive(r.status) &&
      rangesOverlap(candidate.startDate, candidate.endDate, r.startDate, r.endDate)
  );
}

const fileStore: ReservationStore = {
  async list() {
    const rows = await readFile();
    return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async get(id) {
    return (await readFile()).find((r) => r.id === id) ?? null;
  },

  insert(input) {
    return withLock(async () => {
      const rows = await readFile();
      const now = new Date().toISOString();
      const reservation: Reservation = {
        id: crypto.randomUUID(),
        vehicleSlug: input.vehicleSlug,
        vehicleName: input.vehicleName,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        startDate: input.startDate,
        endDate: input.endDate,
        pickupLocation: input.pickupLocation,
        pickupCustom: input.pickupCustom ?? null,
        dropoffLocation: input.dropoffLocation,
        dropoffCustom: input.dropoffCustom ?? null,
        extras: input.extras,
        packId: input.packId ?? null,
        carPrep: input.carPrep ?? null,
        flightInfo: input.flightInfo ?? null,
        total: input.total,
        status: "pending",
        adminNote: null,
        createdAt: now,
        updatedAt: now,
      };
      if (hasOverlap(rows, reservation)) throw new ReservationConflictError();
      rows.push(reservation);
      await writeFile(rows);
      return reservation;
    });
  },

  updateStatus(id, status, adminNote) {
    return withLock(async () => {
      const rows = await readFile();
      const row = rows.find((r) => r.id === id);
      if (!row) throw new Error("Réservation introuvable.");
      if (isActive(status) && hasOverlap(rows, row)) throw new ReservationConflictError();
      row.status = status;
      if (adminNote !== undefined) row.adminNote = adminNote;
      row.updatedAt = new Date().toISOString();
      await writeFile(rows);
      return row;
    });
  },

  async countSince(phone, sinceISO) {
    return (await readFile()).filter((r) => r.customerPhone === phone && r.createdAt >= sinceISO).length;
  },

  async activeRanges(vehicleSlug) {
    return (await readFile())
      .filter((r) => isActive(r.status) && (!vehicleSlug || r.vehicleSlug === vehicleSlug))
      .map((r) => ({ vehicleSlug: r.vehicleSlug, startDate: r.startDate, endDate: r.endDate }));
  },
};

function store(): ReservationStore {
  if (isSupabaseConfigured()) return supabaseStore;
  // Serverless instances on Vercel don't share a disk, so a file store would silently
  // lose or split data there. Require the real database in that environment.
  if (process.env.VERCEL) {
    throw new Error(
      "Base de données non configurée : ajoutez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans les variables d'environnement Vercel."
    );
  }
  return fileStore;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function countTodayReservationsByPhone(phone: string): Promise<number> {
  return store().countSince(phone, startOfTodayInCasablanca());
}

export async function getBlockedRangesByVehicle(): Promise<Record<string, [string, string][]>> {
  const map: Record<string, [string, string][]> = {};
  for (const r of await store().activeRanges()) {
    (map[r.vehicleSlug] ??= []).push([r.startDate, r.endDate]);
  }
  return map;
}

export async function isVehicleFreeServerSide(vehicleSlug: string, startDate: string, endDate: string): Promise<boolean> {
  const ranges = await store().activeRanges(vehicleSlug);
  return !ranges.some((r) => rangesOverlap(startDate, endDate, r.startDate, r.endDate));
}

export function createReservation(input: NewReservationInput): Promise<Reservation> {
  return store().insert(input);
}

export function listReservations(): Promise<Reservation[]> {
  return store().list();
}

export function getReservationById(id: string): Promise<Reservation | null> {
  return store().get(id);
}

export function updateReservationStatus(
  id: string,
  status: ReservationStatus,
  adminNote?: string | null
): Promise<Reservation> {
  return store().updateStatus(id, status, adminNote);
}
