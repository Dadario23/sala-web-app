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
  const reservations = useAppSelector(selectReservations);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [canGoBack, setCanGoBack] = useState(false);
  const [reservationsLoaded, setReservationsLoaded] = useState(false);
  const router = useRouter();

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadReservations = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchReservations(today);
        const filteredReservations = filterReservationsForToday(data, today);
        const sortedReservations = sortReservationsByTime(filteredReservations);

        dispatch(setReservations(sortedReservations));
        setReservationsLoaded(true);
      } catch (err) {
        setError(
          "No se pudieron cargar las reservas. Por favor, intente más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    if (!reservationsLoaded && reservations.length === 0) {
      loadReservations();
    } else {
      setLoading(false);
    }
  }, [dispatch, reservations, today, reservationsLoaded]);

  useEffect(() => {
    if (window.history.length > 1) {
      setCanGoBack(true);
    } else {
      setCanGoBack(false);
    }
  }, []);

  const reservationsForToday = reservations.filter(
    (reservation) => reservation.date === today
  );

  return (
    <>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
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
                onClick={() => router.back()}
              />
            )}
          </div>
          <div className="w-full max-w-4xl mx-auto p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {reservationsForToday.length > 0 ? (
              reservationsForToday.map((reservation, index) => (
                <Card
                  key={index}
                  className={`transition-transform duration-300 transform hover:scale-105 hover:shadow-lg ${
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
              <p></p>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
