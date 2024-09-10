import { Reservation } from "@/types/Reservation";

export const fetchReservations = async (
  date: string,
  bandName?: string
): Promise<Reservation[]> => {
  const response = await fetch("/api/reservations/getReservations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ date, bandName }),
  });

  if (!response.ok) {
    throw new Error("Error fetching reservations");
  }

  return response.json();
};
