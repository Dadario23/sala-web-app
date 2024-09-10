import { getReservations } from "@/services/backend/reservation/getReservations";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { date, bandName } = req.body;

  try {
    const reservations = await getReservations(date, bandName);
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error al obtener la reserva:", error);
    res.status(500).json({ error: "Error al obtener la reserva" });
  }
};
