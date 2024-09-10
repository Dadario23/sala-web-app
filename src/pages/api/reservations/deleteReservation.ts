import { deleteReservationById } from "@/services/backend/reservation/deleteReservation";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { reservationId } = req.body;

  if (!reservationId) {
    return res.status(400).json({ error: "El ID de la reserva es requerido" });
  }

  try {
    await deleteReservationById(reservationId);
    res.status(200).json({ message: "Reserva eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la reserva:", error);
    res.status(500).json({ error: "Error al eliminar la reserva" });
  }
};
