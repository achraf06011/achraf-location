"use client";

import { useEffect, useState } from "react";
import type { ReservationStatus } from "./reservationTypes";

export function useReservationStatus(id: string | null | undefined) {
  const [status, setStatus] = useState<ReservationStatus | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    fetch(`/api/reservations/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.status) setStatus(data.status);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [id]);

  return status;
}
