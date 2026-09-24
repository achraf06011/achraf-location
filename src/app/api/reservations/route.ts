import { NextResponse } from "next/server";
import {
  countTodayReservationsByPhone,
  createReservation,
  isVehicleFreeServerSide,
  type NewReservationInput,
} from "@/lib/reservations";

export const SUPPORT_PHONE = "+212 (0) 697-601775";
const DAILY_RESERVATION_LIMIT = 5;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.vehicleSlug !== "string" ||
    typeof body.vehicleName !== "string" ||
    typeof body.customerName !== "string" ||
    typeof body.customerPhone !== "string" ||
    typeof body.startDate !== "string" ||
    typeof body.endDate !== "string" ||
    typeof body.total !== "number"
  ) {
    return NextResponse.json({ error: "Informations de réservation incomplètes." }, { status: 400 });
  }

  const customerPhone = body.customerPhone.trim().replace(/[\s-]/g, "");
  const customerName = body.customerName.trim();

  if (customerPhone.length < 6 || customerName.length < 2) {
    return NextResponse.json({ error: "Nom ou téléphone invalide." }, { status: 400 });
  }

  try {
    const todayCount = await countTodayReservationsByPhone(customerPhone);
    if (todayCount >= DAILY_RESERVATION_LIMIT) {
      return NextResponse.json(
        {
          error: "blocked",
          message: `Vous avez atteint la limite de ${DAILY_RESERVATION_LIMIT} réservations aujourd'hui. Merci d'appeler le service de location au ${SUPPORT_PHONE}.`,
          phone: SUPPORT_PHONE,
        },
        { status: 429 }
      );
    }

    const free = await isVehicleFreeServerSide(body.vehicleSlug, body.startDate, body.endDate);
    if (!free) {
      return NextResponse.json(
        { error: "unavailable", message: "Ce véhicule vient d'être réservé pour ces dates par un autre client." },
        { status: 409 }
      );
    }

    const input: NewReservationInput = {
      vehicleSlug: body.vehicleSlug,
      vehicleName: body.vehicleName,
      customerName,
      customerPhone,
      startDate: body.startDate,
      endDate: body.endDate,
      pickupLocation: body.pickupLocation ?? "agence",
      pickupCustom: body.pickupCustom ?? undefined,
      dropoffLocation: body.dropoffLocation ?? "agence",
      dropoffCustom: body.dropoffCustom ?? undefined,
      extras: Array.isArray(body.extras) ? body.extras : [],
      packId: body.packId ?? null,
      carPrep: body.carPrep ?? null,
      flightInfo: body.flightInfo ?? null,
      total: body.total,
    };

    const reservation = await createReservation(input);
    return NextResponse.json({ reservation }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
