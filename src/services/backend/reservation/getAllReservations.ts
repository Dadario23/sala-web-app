import { RESERVATION_SHEET_RANGE } from "@/constants/sheets";
import { getSheetValues } from "@/services/googleSheetsService";

export const getAllReservations = async () => {
  const rows = await getSheetValues(RESERVATION_SHEET_RANGE);

  if (!rows || rows.length <= 1) {
    return [];
  }

  return rows
    .slice(1) // Omitir encabezados
    .filter((row) => row[0] && row[1] && row[2] && row[3] && row[4] && row[6])
    .map((row) => ({
      reservationId: row[6],
      bandName: row[0],
      date: row[1],
      startTime: row[2],
      endTime: row[3],
      status: row[4],
    }));
};
