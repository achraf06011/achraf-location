import { NextResponse } from "next/server";
import { getReservationById } from "@/lib/reservations";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const reservation = await getReservationById(id);
    if (!reservation) {
      return NextResponse.json({ error: "Introuvable." }, { status: 404 });
    }
    return NextResponse.json({
      status: reservation.status,
      updatedAt: reservation.updatedAt,
    });
  } catch {
    return NextResponse.json({ error: "Indisponible." }, { status: 503 });
  }
}
