import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/adminAuth";
import { listReservations, startOfTodayInCasablanca } from "@/lib/reservations";
import type { AdminReservation } from "@/lib/reservationTypes";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!(await isValidAdminToken(token))) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const rows = await listReservations();
    const since = startOfTodayInCasablanca();
    const todayByPhone = new Map<string, number>();
    for (const r of rows) {
      if (r.createdAt >= since) todayByPhone.set(r.customerPhone, (todayByPhone.get(r.customerPhone) ?? 0) + 1);
    }
    const reservations: AdminReservation[] = rows.map((r) => ({
      ...r,
      phoneTodayCount: todayByPhone.get(r.customerPhone) ?? 0,
    }));
    return NextResponse.json({ reservations });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur." },
      { status: 500 }
    );
  }
}
