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
