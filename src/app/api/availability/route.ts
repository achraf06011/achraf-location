import { NextResponse } from "next/server";
import { getBlockedRangesByVehicle } from "@/lib/reservations";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ranges = await getBlockedRangesByVehicle();
    return NextResponse.json({ ranges });
  } catch {
    // Supabase not configured yet, or unreachable: fail open with no extra ranges
    // so the demo still works purely off the static per-vehicle data.
    return NextResponse.json({ ranges: {} });
  }
}
