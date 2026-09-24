import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/adminAuth";
import { ReservationConflictError, updateReservationStatus, type ReservationStatus } from "@/lib/reservations";

const VALID_STATUSES: ReservationStatus[] = ["pending", "confirmed", "rejected"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!(await isValidAdminToken(token))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status as ReservationStatus | undefined;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const adminNote = typeof body?.adminNote === "string" ? body.adminNote.trim() || null : undefined;

  try {
    const reservation = await updateReservationStatus(id, status, adminNote);
    return NextResponse.json({ reservation });
  } catch (err) {
    if (err instanceof ReservationConflictError) {
      return NextResponse.json(
        { error: "Impossible : ce véhicule a entre-temps été réservé par un autre client sur ces dates." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
