"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import ClipLoader from "react-spinners/ClipLoader";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ArrowLeftCircle } from "@geist-ui/icons";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setBands as setReduxBands,
  selectBands,
} from "@/lib/features/bands/bandsSlice";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import Image from "next/image";
import editIcon from "@/assets/create-outline.svg";
import { deleteReservationsByBand } from "@/lib/features/reservations/reservationsSlice";

const BandsPage = () => {
  const dispatch = useAppDispatch();
  const globalBands = useAppSelector(selectBands);
  const [newBandName, setNewBandName] = useState("");
  const [editingBand, setEditingBand] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [bandsLoaded, setBandsLoaded] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadBands = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/bands/getBands");
        const data = await response.json();

        if (Array.isArray(data)) {
          dispatch(
            setReduxBands(
              data.map((band) => ({ ...band, name: band.name.toUpperCase() }))
            )
          );
          setBandsLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching bands:", error);
      } finally {
        setLoading(false);
      }
    };

    if (globalBands.length === 0 && !bandsLoaded) {
      loadBands();
    } else {
      setLoading(false);
    }
  }, [dispatch, globalBands, bandsLoaded]);

  const handleAddBand = async () => {
    if (newBandName) {
      try {
        const response = await fetch("/api/bands/addBand", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newBandName.toUpperCase() }),
        });

        const addedBand = await response.json();

        if (addedBand && addedBand.id && addedBand.name) {
          dispatch(
            setReduxBands([
              ...globalBands,
              { id: addedBand.id, name: addedBand.name.toUpperCase() },
            ])
          );
          setNewBandName("");

          toast({
            title: "Banda agregada con éxito",
            description: `La banda ${addedBand.name} ha sido agregada.`,
            action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
          });
        } else if (response.status === 500) {
          toast({
            title: "Error",
            description: "La banda ya existe.",
            action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
          });
        }
      } catch (error) {
        console.error("Error adding band:", error);
      }
    }
  };

  const handleDeleteBand = async (id: string) => {
    try {
      const response = await fetch("/api/bands/deleteBand", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        dispatch(setReduxBands(globalBands.filter((band) => band.id !== id)));
        dispatch(deleteReservationsByBand(id));

        toast({
          title: "Banda eliminada con éxito",
          description: "La banda y sus reservas han sido eliminadas.",
          action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
        });
      } else {
        console.error("Error al eliminar la banda");
      }
    } catch (error) {
      console.error("Error eliminando la banda:", error);
    }
  };

  const handleEditBand = async () => {
    if (editingBand && editingBand.id && editingBand.name) {
      try {
        const response = await fetch(`/api/bands/editBand`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingBand.id,
            name: editingBand.name.toUpperCase(),
          }),
        });

        if (response.ok) {
          const updatedBand = await response.json();

          const updatedBands = globalBands.map((band) =>
            band.id === updatedBand.id
              ? { ...band, name: updatedBand.name.toUpperCase() }
              : band
          );

          dispatch(setReduxBands(updatedBands));
          setEditingBand(null);

          toast({
            title: "Banda actualizada con éxito",
            description: `La banda ${updatedBand.name} ha sido actualizada.`,
            action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
          });
        } else {
          console.error("Error al actualizar la banda");
        }
      } catch (error) {
        console.error("Error editing band:", error);
      }
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
          <CardTitle>Gestión de Bandas</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Agregar banda</Label>
          <div className="flex items-center space-x-4 mt-2">
            <Input
              value={newBandName}
              onChange={(e) => setNewBandName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddBand()}
              placeholder="Nombre de la nueva banda"
              className="flex-grow"
            />

            <Button variant="secondary" onClick={handleAddBand}>
              Agregar
            </Button>
          </div>

          <h3 className="text-lg font-semibold mt-12 mb-4">
            Listado de Bandas
          </h3>

          {loading ? (
            <div className="flex justify-center items-center h-64 w-full">
              <ClipLoader color="#3498db" loading={loading} size={25} />
            </div>
          ) : (
            <Table>
              <TableCaption>
                Lista de bandas disponibles para gestionar.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nombre de Banda</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {globalBands.length > 0 ? (
                  globalBands.map((band) => (
                    <TableRow key={band.id}>
                      <TableCell>
                        {editingBand && editingBand.id === band.id ? (
                          <Input
                            value={editingBand.name}
                            onChange={(e) =>
                              setEditingBand({
                                ...editingBand,
                                name: e.target.value.toUpperCase(),
                              })
                            }
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleEditBand()
                            }
                            placeholder="Editar nombre de banda"
                          />
                        ) : (
                          <span>{band.name}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {editingBand && editingBand.id === band.id ? (
                          <Button variant="outline" onClick={handleEditBand}>
                            Actualizar
                          </Button>
                        ) : (
                          <>
                            <div className="relative group inline-block">
                              <button onClick={() => setEditingBand(band)}>
                                <Image
                                  src={editIcon}
                                  alt="Editar"
                                  className="w-5 h-5"
                                />
                              </button>
                              <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-8 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded py-1 px-2 pointer-events-none">
                                Editar
                              </span>
                            </div>
                            <ConfirmDeleteDialog
                              item={band.id}
                              onConfirm={handleDeleteBand}
                              itemName={band.name}
                              description="¿Estás seguro de que quieres eliminar esta banda?"
                            />
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center">
                      No hay bandas disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BandsPage;
