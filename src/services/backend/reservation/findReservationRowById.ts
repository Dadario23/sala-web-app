import { getSheetValues } from "@/services/googleSheetsService";

export const findReservationRowById = async (
  reservationId: string
): Promise<number | null> => {
  const rows = await getSheetValues("'Reservas'!G:G");
  const rowIndex = rows.findIndex((row) => row[0] === reservationId);
  return rowIndex >= 0 ? rowIndex + 1 : null;
};
