import { NextResponse } from "next/server";
import {
  countTodayReservationsByPhone,
  createReservation,
  isVehicleFreeServerSide,
  normalizePhone,
  ReservationConflictError,
  type NewReservationInput,
} from "@/lib/reservations";
import { DAILY_RESERVATION_LIMIT, SUPPORT_PHONE } from "@/lib/reservationTypes";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const UNAVAILABLE = {
  error: "unavailable",
  message: "Ce véhicule vient d'être réservé pour ces dates par un autre client. Choisissez d'autres dates ou un autre véhicule.",
};

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

  const customerPhone = normalizePhone(body.customerPhone);
  const customerName = body.customerName.trim();

  if (!/^\+?\d{8,15}$/.test(customerPhone) || customerName.length < 2) {
    return NextResponse.json({ error: "invalid", message: "Nom ou numéro de téléphone invalide." }, { status: 400 });
  }

  if (!ISO_DATE.test(body.startDate) || !ISO_DATE.test(body.endDate) || body.endDate < body.startDate) {
    return NextResponse.json({ error: "invalid", message: "Dates de location invalides." }, { status: 400 });
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

    if (!(await isVehicleFreeServerSide(body.vehicleSlug, body.startDate, body.endDate))) {
      return NextResponse.json(UNAVAILABLE, { status: 409 });
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
    return NextResponse.json({ reservation: { id: reservation.id, status: reservation.status } }, { status: 201 });
  } catch (err) {
    if (err instanceof ReservationConflictError) {
      return NextResponse.json(UNAVAILABLE, { status: 409 });
    }
    console.error("[reservations] create failed", err);
    return NextResponse.json(
      { error: "server", message: "Le service de réservation est momentanément indisponible. Réessayez ou appelez-nous." },
      { status: 500 }
    );
  }
}
