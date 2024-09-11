import { format } from "date-fns";

export const calculateAvailableTimes = (
  occupiedTimes: { startTime: string; endTime: string }[],
  duration: number,
  date?: Date
) => {
  const now = new Date();

  if (!date) {
    //console.log("No date selected, returning empty array");
    return [];
  }

  const isToday = format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
  const currentHour = now.getHours();

  /* console.log(
    "Calculating available times for date:",
    date,
    "isToday:",
    isToday,
    "currentHour:",
    currentHour
  ); */

  // Creamos los slots de inicio de 9:00 a 24:00
  const startTimeSlots = Array.from({ length: 16 }, (_, i) => i + 9);

  // Convertimos los tiempos ocupados en un array de horas ocupadas
  const occupiedHours = occupiedTimes.flatMap((reservation) => {
    const startHour = parseInt(reservation.startTime.split(":")[0], 10);
    const endHour = parseInt(reservation.endTime.split(":")[0], 10);
    /* console.log(
      "Processing reservation:",
      reservation,
      "occupied from",
      startHour,
      "to",
      endHour
    ); */
    return Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  });

  //console.log("Occupied hours:", occupiedHours);

  // Reducimos los slots de tiempo para filtrar los que están disponibles
  const availableSlots = startTimeSlots.reduce(
    (acc: string[], startHour: number) => {
      const endHour = startHour + duration;

      // Si es el día de hoy, excluimos las horas que ya pasaron
      if (isToday && startHour <= currentHour) {
        //console.log(`Skipping ${startHour}:00 as it's in the past`);
        return acc; // Continuamos con el siguiente slot
      }

      // Verificamos si todas las horas del slot están libres
      const slotIsFree = Array.from(
        { length: duration },
        (_, i) => startHour + i
      ).every((hour) => !occupiedHours.includes(hour));

      if (slotIsFree && endHour <= 24) {
        acc.push(`${startHour}:00 a ${endHour}:00`);
      }

      return acc;
    },
    []
  );

  //console.log("Available slots:", availableSlots);

  return availableSlots;
};
