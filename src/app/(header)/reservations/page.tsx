"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import ClipLoader from "react-spinners/ClipLoader";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setReservations,
  deleteReservation as deleteReservationAction,
} from "@/lib/features/reservations/reservationsSlice";
import { ArrowLeftCircle } from "@geist-ui/icons";
import { Band } from "@/types/band";
import { Reservation } from "@/types/Reservation";

const ReservationsPage = () => {
  const [date, setDate] = useState("");
  const [bandName, setBandName] = useState<string | null>(null);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [bands, setBands] = useState<Band[]>([]);
  const [loading, setLoading] = useState(false);
  const [reservationsLoaded, setReservationsLoaded] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const reservations = useAppSelector((state) => state.reservations.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadAllReservations = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/reservations/getAllReservations");
        const data = await response.json();
        const formattedReservations = data.map((reservation: Reservation) => ({
          ...reservation,
          bandName: reservation.bandName.toUpperCase(),
        }));

        dispatch(setReservations(formattedReservations));
        setFilteredReservations(formattedReservations);
        setReservationsLoaded(true);
      } catch (err) {
        console.error("Error fetching all reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    if (reservations.length === 0 && !reservationsLoaded) {
      loadAllReservations();
    } else {
      setFilteredReservations(reservations);
    }
  }, [dispatch, reservations, reservationsLoaded]);

  useEffect(() => {
    const loadBands = async () => {
      try {
        const response = await fetch("/api/bands/getBands");
        const data = await response.json();
        setBands(data);
      } catch (err) {
        console.error("Error fetching bands:", err);
      }
    };
    loadBands();
  }, []);

  const handleSearch = () => {
    const filtered = reservations.filter((reservation) => {
      const matchesBand =
        !bandName || reservation.bandName === bandName.toUpperCase();
      const matchesDate = !date || reservation.date === date;
      return matchesBand && matchesDate;
    });
    setFilteredReservations(filtered);
  };

  const handleDeleteReservation = async (reservation: Reservation) => {
    try {
      const response = await fetch("/api/reservations/deleteReservation", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId: reservation.reservationId }),
      });

      if (response.ok) {
        dispatch(deleteReservationAction(reservation.reservationId));
        toast({ title: "Reserva eliminada con éxito" });
      } else {
        toast({ title: "Error al eliminar la reserva" });
      }
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      toast({ title: "Error al eliminar la reserva" });
    }
  };

  useEffect(() => {
    console.log("Estado de las reservas actualizado:", reservations);
  }, [reservations]);

  return (
    <div className="flex flex-col items-start justify-center mt-8 sm:flex-row sm:items-start sm:justify-center">
      <div className="flex flex-row justify-between w-full sm:w-auto mb-4">
        <ArrowLeftCircle
          className="cursor-pointer mb-8 sm:mb-0 w-8 h-8 mr-8"
          onClick={() => router.push("/home")}
        />
      </div>

      <Card className="w-full max-w-[330px] sm:max-w-sm md:max-w-4xl mx-auto px-4">
        <CardHeader>
          <CardTitle className="text-center text-lg md:text-2xl">
            Listado de Reservas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div className="w-full">
              <Label htmlFor="bandName">Filtrar reservas</Label>
              <Select
                value={bandName || "none"}
                onValueChange={(value) =>
                  setBandName(value === "none" ? null : value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione la banda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">TODAS LAS RESERVAS</SelectItem>
                  {bands.map((band) => (
                    <SelectItem key={band.id} value={band.name}>
                      {band.name.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label htmlFor="date">Filtrar por Fecha</Label>
              <Input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex justify-evenly"
              />
            </div>

            <Button onClick={handleSearch} className="w-full md:w-auto">
              Buscar
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 w-full">
              <ClipLoader color="#3498db" loading={loading} size={25} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4 sm:w-auto min-w-[7rem]">
                      Fecha
                    </TableHead>
                    <TableHead>Banda</TableHead>
                    <TableHead>Inicio</TableHead>
                    <TableHead>Fin</TableHead>
                    <TableHead className="w-20">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {reservation.date.split("-").reverse().join("-")}
                        </TableCell>
                        <TableCell>{reservation.bandName}</TableCell>
                        <TableCell>{reservation.startTime}</TableCell>
                        <TableCell>{reservation.endTime}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <ConfirmDeleteDialog
                              item={reservation}
                              onConfirm={() =>
                                handleDeleteReservation(reservation)
                              }
                              itemName={reservation.bandName}
                              description="¿Estás seguro de que quieres eliminar la reserva de"
                              additionalInfo={reservation.date}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No hay reservas disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationsPage;
