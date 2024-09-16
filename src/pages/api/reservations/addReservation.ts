import { addReservation } from "@/services/backend/reservation/addReservation";
import { getReservations } from "@/services/backend/reservation/getReservations";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { bandId, bandName, date, startTime, endTime } = req.body;

  if (!bandId || !bandName || !date || !startTime || !endTime) {
    return res.status(400).json({ error: "Faltan datos de la reserva" });
  }

  try {
    const existingReservations = await getReservations(date);
    const conflict = existingReservations.some((reservation) => {
      const reservationStart = parseInt(
        reservation.startTime.split(":")[0],
        10
      );
      const reservationEnd = parseInt(reservation.endTime.split(":")[0], 10);
      const newStart = parseInt(startTime.split(":")[0], 10);
      const newEnd = parseInt(endTime.split(":")[0], 10);

      return (
        (newStart >= reservationStart && newStart < reservationEnd) ||
        (newEnd > reservationStart && newEnd <= reservationEnd) ||
        (newStart < reservationStart && newEnd > reservationEnd)
      );
    });

    if (conflict) {
      return res.status(400).json({ error: "El horario ya está reservado" });
    }

    const result = await addReservation(
      bandId,
      bandName,
      date,
      startTime,
      endTime
    );
    res.status(200).json({ success: true, result });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al agregar la reserva:", error.message);
      res
        .status(500)
        .json({ error: error.message || "Error al agregar la reserva" });
    } else {
      console.error("Unknown error occurred:", error);
      res.status(500).json({ error: "Error al agregar la reserva" });
    }
  }
};
