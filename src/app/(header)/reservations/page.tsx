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
import { ToastAction } from "@/components/ui/toast";

interface Reservation {
  reservationId: string;
  bandName: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Band {
  id: string;
  name: string;
}

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [date, setDate] = useState("");
  const [bandName, setBandName] = useState<string | null>(null);

  const [bands, setBands] = useState<Band[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadAllReservations = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/reservations/getAllReservations");
        const data = await response.json();
        setReservations(
          data.map((reservation: Reservation) => ({
            ...reservation,
            bandName: reservation.bandName.toUpperCase(),
          }))
        );
      } catch (err) {
        console.error("Error fetching all reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAllReservations();
  }, []);

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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reservations/getReservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          bandName: bandName || null,
        }),
      });

      const data = await response.json();
      setReservations(
        data.map((reservation: Reservation) => ({
          ...reservation,
          bandName: reservation.bandName.toUpperCase(),
        }))
      );
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReservation = async (reservation: Reservation) => {
    try {
      const response = await fetch("/api/reservations/deleteReservation", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: reservation.reservationId,
        }),
      });

      if (response.ok) {
        setReservations(reservations.filter((r) => r !== reservation));
        toast({
          title: "Reserva eliminada con éxito",
          action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
        });
      } else {
        console.error("Error al eliminar la reserva");
        toast({
          title: "Error al eliminar la reserva",
          action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
        });
      }
    } catch (error) {
      console.error("Error al eliminar la reserva", error);
      toast({
        title: "Error al eliminar la reserva",
        action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
      });
    }
  };

  return (
    <Card className="w-full max-w-[90%] md:max-w-[600px] mx-auto mt-10 h-auto">
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
                    {band.name.toUpperCase()} {/* Mostrar en mayúsculas */}
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
                  <TableHead>Banda</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead className="w-20">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.length > 0 ? (
                  reservations.map((reservation, index) => (
                    <TableRow key={index}>
                      <TableCell>{reservation.bandName}</TableCell>
                      <TableCell>
                        {reservation.date.split("-").reverse().join("-")}
                      </TableCell>
                      <TableCell>{reservation.startTime}</TableCell>
                      <TableCell>{reservation.endTime}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <ConfirmDeleteDialog
                            item={reservation}
                            onConfirm={handleDeleteReservation}
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
  );
};

export default ReservationsPage;
