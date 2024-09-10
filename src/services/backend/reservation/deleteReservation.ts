import { clearSheetRange } from "@/services/googleSheetsService";
import { findReservationRowById } from "./findReservationRowById";

export const deleteReservationById = async (reservationId: string) => {
  const rowIndex = await findReservationRowById(reservationId);

  if (rowIndex === null) {
    throw new Error("Reserva no encontrada");
  }

  await clearSheetRange(`'Reservas'!A${rowIndex}:G${rowIndex}`);
};
