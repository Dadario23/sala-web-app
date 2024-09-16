import { RESERVATION_SHEET_RANGE } from "@/constants/sheets";
import { getSheetValues } from "@/services/googleSheetsService";

export const getReservations = async (date?: string, bandName?: string) => {
  const rows = await getSheetValues(RESERVATION_SHEET_RANGE);

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows
    .slice(1)
    .filter((row) => row[0] && row[1] && row[2] && row[3] && row[4] && row[6])
    .filter((row) => {
      const reservationDate = row[1];
      const matchesDate = date ? reservationDate === date : true;
      const reservationBand = row[0].trim().toLowerCase();
      const filterBand = bandName ? bandName.trim().toLowerCase() : null;
      const matchesBand = bandName ? reservationBand === filterBand : true;

      return matchesDate && matchesBand;
    })
    .map((row) => ({
      bandName: row[0],
      date: row[1],
      startTime: row[2],
      endTime: row[3],
      status: row[4],
      bandId: row[5],
      reservationId: row[6],
    }));
};
