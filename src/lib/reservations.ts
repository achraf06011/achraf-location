import "server-only";
import { getSupabaseAdmin } from "./supabaseAdmin";
import type { Reservation, ReservationStatus, NewReservationInput } from "./reservationTypes";

export type { Reservation, ReservationStatus, NewReservationInput };

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

const ACTIVE_STATUSES: ReservationStatus[] = ["pending", "confirmed"];

export async function countTodayReservationsByPhone(phone: string): Promise<number> {
  const supabase = getSupabaseAdmin();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("reservations")
    .select("id", { count: "exact", head: true })
    .eq("customer_phone", phone)
    .gte("created_at", startOfDay.toISOString());

  if (error) throw error;
  return count ?? 0;
}

export async function getBlockedRangesByVehicle(): Promise<Record<string, [string, string][]>> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("reservations")
    .select("vehicle_slug, start_date, end_date")
    .in("status", ACTIVE_STATUSES);

  if (error) throw error;

  const map: Record<string, [string, string][]> = {};
  for (const row of data ?? []) {
    const slug = row.vehicle_slug as string;
    if (!map[slug]) map[slug] = [];
    map[slug].push([row.start_date as string, row.end_date as string]);
  }
  return map;
}

function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export async function isVehicleFreeServerSide(
  vehicleSlug: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("reservations")
    .select("start_date, end_date")
    .eq("vehicle_slug", vehicleSlug)
    .in("status", ACTIVE_STATUSES);

  if (error) throw error;

  return !(data ?? []).some((row) =>
    rangesOverlap(startDate, endDate, row.start_date as string, row.end_date as string)
  );
}

export async function createReservation(input: NewReservationInput): Promise<Reservation> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
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

  if (error) throw error;
  return mapRow(data);
}

export async function listReservations(): Promise<Reservation[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getReservationById(id: string): Promise<Reservation | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("reservations").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
  adminNote?: string
): Promise<Reservation> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("reservations")
    .update({ status, admin_note: adminNote ?? null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapRow(data);
}
