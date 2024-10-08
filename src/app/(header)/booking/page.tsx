"use client";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { calculateAvailableTimes } from "@/utils/calculateAvailableTimes";
import { format } from "date-fns";
import { fetchReservations } from "@/services/frontend/fetchReservations";
import { ArrowLeftCircle } from "@geist-ui/icons";
import { useDispatch } from "react-redux";
import { addReservation as addReservationToStore } from "@/lib/features/reservations/reservationsSlice";

const bookingPage = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(
    null
  );
  const [band, setBand] = useState<string | null>(null);
  const [bands, setBands] = useState<{ id: string; name: string }[]>([]);
  const [isNewBand, setIsNewBand] = useState<boolean>(false);
  const [selectedBandId, setSelectedBandId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadReservations = async () => {
      if (!date) return;

      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const occupiedReservations = await fetchReservations(formattedDate);

        if (selectedDuration) {
          const available = calculateAvailableTimes(
            occupiedReservations,
            selectedDuration,
            date
          );

          setAvailableTimes(available);
        }
      } catch (err) {
        console.error("BookingPage: Error cargando reservas:", err);
        setAvailableTimes([]);
      }
    };

    loadReservations();
  }, [date, selectedDuration]);

  useEffect(() => {
    const loadBands = async () => {
      try {
        const response = await fetch("/api/bands/getBands");
        const data = await response.json();
        const upperCaseBands = data.map(
          (band: { id: string; name: string }) => ({
            ...band,
            name: band.name.toUpperCase(),
          })
        );

        setBands(upperCaseBands);
      } catch (err) {
        console.error("BookingPage: Error cargando bandas:", err);
      }
    };

    loadBands();
  }, []);

  const handleReservation = async () => {
    if (!band || !date || !selectedStartTime || !selectedBandId) return;

    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const [startTime, endTime] = selectedStartTime.split(" a ");

      const response = await fetch("/api/reservations/addReservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bandId: selectedBandId,
          bandName: band,
          date: formattedDate,
          startTime,
          endTime,
        }),
      });

      const data = await response.json();

      if (response.ok && data.result) {
        const { reservationId } = data.result;

        toast({
          title: "Reserva realizada con éxito",
          description: `Para la banda ${band} el dia ${formattedDate} de ${startTime} a ${endTime}`,
          action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
        });

        dispatch(
          addReservationToStore({
            reservationId: reservationId,
            bandId: selectedBandId,
            bandName: band,
            date: formattedDate,
            startTime,
            endTime,
          })
        );

        updateAvailableTimes(formattedDate);
      } else {
        toast({
          title: "Error",
          description: "No se pudo realizar la reserva.",
          action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
        });
      }
    } catch (err) {
      console.error("BookingPage: Error realizando la reserva:", err);
    }
  };

  const updateAvailableTimes = async (formattedDate: string) => {
    try {
      const response = await fetch("/api/reservations/getReservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: formattedDate }),
      });

      const occupiedReservations = await response.json();

      if (selectedDuration !== null && date) {
        const available = calculateAvailableTimes(
          occupiedReservations,
          selectedDuration,
          date
        );
        setAvailableTimes(available);
        setSelectedStartTime(null);
      }
    } catch (err) {
      console.error("BookingPage: Error actualizando horarios:", err);
      setAvailableTimes([]);
    }
  };

  const handleSelectBand = (name: string) => {
    const selectedBand = bands.find((band) => band.name === name);
    if (selectedBand) {
      setSelectedBandId(selectedBand.id);
      setBand(selectedBand.name);
    }
  };

  return (
    <div className="flex flex-col items-start justify-center mt-8 sm:flex-row sm:items-start sm:justify-center">
      <ArrowLeftCircle
        className="cursor-pointer mb-8 sm:mb-0 w-8 h-8 mr-8"
        onClick={() => router.push("/home")}
      />

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Reservar Sala</CardTitle>
          <CardDescription>
            Seleccione una fecha, una banda, duración y horario disponible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => setDate(newDate)}
            className="rounded-md border shadow"
            disabled={{ before: startOfToday() }}
            locale={es}
            initialFocus
          />

          {date && (
            <div className="mt-4">
              <Label htmlFor="band">Listado de bandas</Label>
              <Select onValueChange={(value) => handleSelectBand(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la banda" />
                </SelectTrigger>
                <SelectContent>
                  {bands.map((band) => (
                    <SelectItem key={band.id} value={band.name}>
                      {band.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isNewBand && (
                <div className="mt-2">
                  <Label htmlFor="newBand">Nueva Banda</Label>
                  <Input
                    id="newBand"
                    placeholder="Nombre de la banda"
                    onChange={(e) => setBand(e.target.value)}
                  />
                </div>
              )}

              <Label htmlFor="duration" className="mt-4">
                Seleccione duración
              </Label>
              <Select
                onValueChange={(value) => setSelectedDuration(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Duración" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 HORA</SelectItem>
                  <SelectItem value="2">2 HORAS</SelectItem>
                  <SelectItem value="3">3 HORAS</SelectItem>
                  <SelectItem value="4">4 HORAS</SelectItem>
                  <SelectItem value="5">5 HORAS</SelectItem>
                </SelectContent>
              </Select>

              {selectedDuration && (
                <div className="mt-4">
                  <Label htmlFor="time">Seleccione horario</Label>
                  <Select
                    onValueChange={(value) => setSelectedStartTime(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Horario disponible" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.length > 0 ? (
                        availableTimes.map((time, index) => (
                          <SelectItem key={index} value={time}>
                            {time}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="no-horarios">
                          No hay horarios disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                className="mt-4"
                onClick={handleReservation}
                disabled={!band || !selectedStartTime}
              >
                Reservar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default bookingPage;
