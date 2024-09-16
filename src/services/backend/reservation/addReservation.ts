import { RESERVATION_SHEET_RANGE } from "@/constants/sheets";
import { appendToSheet } from "@/services/googleSheetsService";
import { v4 as uuidv4 } from "uuid";
export const addReservation = async (
  bandId: string,
  bandName: string,
  date: string,
  startTime: string,
  endTime: string
) => {
  const reservationId = uuidv4();

  await appendToSheet(RESERVATION_SHEET_RANGE, [
    [bandName, date, startTime, endTime, "Reservado", bandId, reservationId],
  ]);

  return {
    reservationId,
    bandName,
    date,
    startTime,
    endTime,
    bandId,
  };
};
