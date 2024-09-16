"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightCircle } from "@geist-ui/icons";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchReservations } from "@/services/frontend/fetchReservations";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setReservations,
  selectReservations,
} from "@/lib/features/reservations/reservationsSlice";
import {
  filterReservationsForToday,
  sortReservationsByTime,
} from "@/utils/reservationUtils";
import { isPastReservation } from "@/utils/dateUtils";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const reservations = useAppSelector(selectReservations); // Obtenemos todas las reservas del estado global
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [canGoBack, setCanGoBack] = useState(false);
  const router = useRouter();

  const today = format(new Date(), "yyyy-MM-dd"); // Fecha de hoy

  // Intervalo para actualizar el tiempo actual
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Cargar reservas solo si no están en el estado global
  useEffect(() => {
    const loadReservations = async () => {
      if (reservations.length > 0) {
        console.log(
          "HomePage: Ya hay reservas cargadas, no es necesario hacer una nueva solicitud."
        );
        setLoading(false);
        return; // Si ya hay reservas, no se hace la llamada
      }

      setLoading(true);
      setError(null);
      try {
        console.log("HomePage: Iniciando carga de reservas...");
        console.log(`HomePage: Fecha de hoy: ${today}`);
        const data = await fetchReservations(today);
        console.log("HomePage: Reservas obtenidas:", data);

        const filteredReservations = filterReservationsForToday(data, today);
        const sortedReservations = sortReservationsByTime(filteredReservations);
        console.log(
          "HomePage: Reservas filtradas y ordenadas:",
          sortedReservations
        );

        dispatch(setReservations(sortedReservations)); // Solo guardamos reservas del día actual
      } catch (err) {
        console.error("HomePage: Error cargando reservas:", err);
        setError("Error cargando reservas.");
      } finally {
        setLoading(false);
        console.log("HomePage: Finalizó la carga de reservas");
      }
    };

    loadReservations();
  }, [dispatch, reservations]);

  useEffect(() => {
    if (window.history.length > 1) {
      setCanGoBack(true);
    } else {
      setCanGoBack(false);
    }
  }, []);

  // Filtrar reservas del estado global para mostrar solo las del día actual
  const reservationsForToday = reservations.filter(
    (reservation) => reservation.date === today
  );

  return (
    <>
      {error ? ( // Mostramos el error si existe
        <p className="text-red-500">{error}</p>
      ) : loading ? ( // Mostramos el loader mientras cargan los datos
        <div className="flex justify-center items-center min-h-screen">
          <ClipLoader color="#3498db" loading={loading} size={50} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between w-full max-w-4xl mx-auto mt-8 px-4">
            <h1 className="text-3xl font-bold">
              {reservationsForToday.length > 0
                ? "ENSAYOS DE HOY"
                : "NO HAY BANDAS PARA HOY"}
            </h1>
            {canGoBack && (
              <ArrowRightCircle
                className="cursor-pointer w-8 h-8 ml-4"
                onClick={() => {
                  router.back();
                }}
              />
            )}
          </div>
          <div className="w-full max-w-4xl mx-auto p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {reservationsForToday.length > 0 ? (
              reservationsForToday.map((reservation, index) => (
                <Card
                  key={index}
                  className={`${
                    isPastReservation(reservation.endTime, currentTime)
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <CardHeader>
                    <CardTitle>{reservation.bandName}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {reservation.startTime} - {reservation.endTime}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p>Ensayo de {reservation.bandName}</p>
                    <p className="text-sm text-gray-400">
                      Estado:{" "}
                      {isPastReservation(reservation.endTime, currentTime)
                        ? "Finalizado"
                        : "En progreso"}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No hay reservas para hoy.</p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
