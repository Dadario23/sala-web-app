export const isPastReservation = (
  endTime: string,
  currentTime: Date = new Date()
): boolean => {
  const [hours, minutes] = endTime.split(":").map(Number);
  const reservationEndTime = new Date();
  reservationEndTime.setHours(hours, minutes, 0);
  return currentTime > reservationEndTime;
};
