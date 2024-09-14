"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightCircle } from "@geist-ui/icons";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchReservations } from "@/services/frontend/fetchReservations";
import {
  filterReservationsForToday,
  sortReservationsByTime,
} from "@/utils/reservationUtils";
import { isPastReservation } from "@/utils/dateUtils";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reservation } from "@/types/Reservation";

const HomePage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [canGoBack, setCanGoBack] = useState(false); // Nuevo estado
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadReservations = async () => {
      setLoading(true);
      try {
        const today = format(new Date(), "yyyy-MM-dd");
        const data = await fetchReservations(today);

        const filteredReservations = filterReservationsForToday(data, today);
        const sortedReservations = sortReservationsByTime(filteredReservations);

        setReservations(sortedReservations);
      } catch (err) {
        console.error("Error fetching reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  useEffect(() => {
    // Verifica si hay historial de navegación
    if (window.history.length > 1) {
      setCanGoBack(true);
      console.log("Hay historial para retroceder.");
    } else {
      setCanGoBack(false);
      console.log("No hay historial para retroceder.");
    }
  }, []);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto mt-8 px-4">
          <h1 className="text-3xl font-bold">ENSAYOS DE HOY</h1>

          {canGoBack && (
            <ArrowRightCircle
              className="cursor-pointer w-8 h-8 ml-4"
              onClick={() => {
                router.back();
              }}
            />
          )}
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen col-span-full">
            <ClipLoader color="#3498db" loading={loading} size={50} />
          </div>
        ) : reservations.length > 0 ? (
          reservations.map((reservation, index) => (
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
          <p className="text-center col-span-full">No hay reservas para hoy.</p>
        )}
      </div>
    </>
  );
};

export default HomePage;
