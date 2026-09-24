import type { CarPrepChoice } from "./types";
import type { FlightInfo, PickupOption } from "@/store/tripStore";

export type ReservationStatus = "pending" | "confirmed" | "rejected";

export interface Reservation {
  id: string;
  vehicleSlug: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  pickupLocation: PickupOption;
  pickupCustom: string | null;
  dropoffLocation: PickupOption;
  dropoffCustom: string | null;
  extras: string[];
  packId: string | null;
  carPrep: CarPrepChoice | null;
  flightInfo: FlightInfo | null;
  total: number;
  status: ReservationStatus;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewReservationInput {
  vehicleSlug: string;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  pickupLocation: PickupOption;
  pickupCustom?: string;
  dropoffLocation: PickupOption;
  dropoffCustom?: string;
  extras: string[];
  packId?: string | null;
  carPrep?: CarPrepChoice | null;
  flightInfo?: FlightInfo | null;
  total: number;
}

export const SUPPORT_PHONE = "+212 (0) 697-601775";
export const SUPPORT_PHONE_TEL = "+212697601775";
export const DAILY_RESERVATION_LIMIT = 5;

export interface AdminReservation extends Reservation {
  /** Reservations submitted today (Casablanca time) with the same phone number. */
  phoneTodayCount: number;
}

/** Short, human-friendly reference shown to clients and admins (first 8 chars of the id). */
export function shortReservationRef(id: string): string {
  return id.slice(0, 8).toUpperCase();
}
