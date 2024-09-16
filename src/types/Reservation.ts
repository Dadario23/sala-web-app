export interface Reservation {
  reservationId: string;
  bandId: string | null; // Asegúrate de que todas las reservas tengan un bandId
  bandName: string;
  date: string;
  startTime: string;
  endTime: string;
  status?: string; // Campo opcional
}
