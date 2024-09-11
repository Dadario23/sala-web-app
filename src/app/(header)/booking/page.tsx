"use client";
import { Calendar } from "@/components/ui/calendar";
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

const bookingPage = () => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [selectedDuration, setSelectedDuration] = React.useState<number | null>(
    null
  );
  const [availableTimes, setAvailableTimes] = React.useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = React.useState<
    string | null
  >(null);
  const [band, setBand] = React.useState<string | null>(null);
  const [bands, setBands] = useState<{ id: string; name: string }[]>([]);
  const [isNewBand, setIsNewBand] = React.useState<boolean>(false);
  const [isReserved, setIsReserved] = React.useState<boolean>(false);
  const [selectedBandId, setSelectedBandId] = React.useState<string | null>(
    null
  );
  const { toast } = useToast();

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
        console.error("Error fetching reservations:", err);
        setAvailableTimes([]);
      }
    };

    loadReservations();
  }, [date, selectedDuration]);

  useEffect(() => {
    const loadBands = async () => {
      try {
        //console.log("Fetching bands");
        const response = await fetch("/api/bands/getBands");
        const data = await response.json();
        const upperCaseBands = data.map(
          (band: { id: string; name: string }) => ({
            ...band,
            name: band.name.toUpperCase(),
          })
        );
        //console.log("Bands fetched:", upperCaseBands);
        setBands(upperCaseBands);
      } catch (err) {
        console.error("Error fetching bands:", err);
      }
    };

    loadBands();
  }, []);

  const handleReservation = async () => {
    if (!band || !date || !selectedStartTime || !selectedBandId) return;

    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const [startTime, endTime] = selectedStartTime.split(" a ");
      /* console.log(
        "Attempting to reserve for band:",
        band,
        " on date:",
        formattedDate,
        "from",
        startTime,
        "to",
        endTime
      ); */

      const reservation = {
        bandId: selectedBandId,
        bandName: band,
        date: formattedDate,
        startTime,
        endTime,
      };

      const response = await fetch("/api/reservations/addReservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
      });

      if (response.ok) {
        toast({
          title: "Reserva realizada con éxito",
          description: `Para la banda ${band} el dia ${formattedDate} de ${startTime} a ${endTime}`,
          action: (
            <ToastAction altText="Goto schedule to undo">Cerrar</ToastAction>
          ),
        });
        //console.log("Reservation successful:", reservation);
        updateAvailableTimes(formattedDate); // Actualiza los horarios disponibles
      } else {
        toast({
          title: "Error",
          description: "No se pudo realizar la reserva.",
          action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
        });
      }
    } catch (err) {
      console.error("Error realizando la reserva:", err);
    }
  };

  const updateAvailableTimes = async (formattedDate: string) => {
    try {
      //console.log("Updating available times for date:", formattedDate);
      const response = await fetch("/api/reservations/getReservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: formattedDate }),
      });

      const occupiedReservations = await response.json();
      //console.log("Occupied reservations for update:", occupiedReservations);
      if (selectedDuration !== null && date) {
        //console.log("Calculating available times during update");
        const available = calculateAvailableTimes(
          occupiedReservations,
          selectedDuration,
          date
        );
        //console.log("Available times during update:", available);
        setAvailableTimes(available);
        setSelectedStartTime(null); // Reinicia la selección de horario
      }
    } catch (err) {
      console.error(
        "Error fetching updated reservations from Google Sheets:",
        err
      );
      setAvailableTimes([]);
    }
  };

  const handleSelectBand = (name: string) => {
    const selectedBand = bands.find((band) => band.name === name);
    if (selectedBand) {
      //console.log("Band selected:", selectedBand.name);
      setSelectedBandId(selectedBand.id);
      setBand(selectedBand.name);
    }
  };

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Reservar Sala</CardTitle>
        <CardDescription>
          Seleccione una fecha, una banda, duracion y horario disponible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            console.log("Date selected:", newDate);
            setDate(newDate);
          }}
          className="rounded-md border shadow"
          disabled={{ before: startOfToday() }}
          locale={es}
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
              onValueChange={(value) => {
                console.log("Duration selected:", value);
                setSelectedDuration(parseInt(value));
              }}
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
                  onValueChange={(value) => {
                    console.log("Start time selected:", value);
                    setSelectedStartTime(value);
                  }}
                  disabled={isReserved}
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
              disabled={!band || !selectedStartTime || isReserved}
            >
              Reservar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default bookingPage;
