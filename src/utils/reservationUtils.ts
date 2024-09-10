import { Reservation } from "@/types/Reservation";
export const filterReservationsForToday = (
  reservations: Reservation[],
  today: string
) => {
  return reservations.filter((reservation) => reservation.date === today);
};
export const sortReservationsByTime = (reservations: Reservation[]) => {
  return reservations.sort((a, b) => {
    const [startHourA, startMinuteA] = a.startTime.split(":").map(Number);
    const [startHourB, startMinuteB] = b.startTime.split(":").map(Number);
    return startHourA === startHourB
      ? startMinuteA - startMinuteB
      : startHourA - startHourB;
  });
};
