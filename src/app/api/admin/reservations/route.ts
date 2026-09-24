import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/adminAuth";
import { listReservations } from "@/lib/reservations";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!(await isValidAdminToken(token))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const reservations = await listReservations();
    return NextResponse.json({ reservations });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
