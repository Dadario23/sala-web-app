export interface Reservation {
  reservationId: string;
  bandId: string | null;
  bandName: string;
  date: string;
  startTime: string;
  endTime: string;
  status?: string;
}
