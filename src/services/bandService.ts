import { v4 as uuidv4 } from "uuid";
import {
  getSheetValues,
  updateSheetValues,
  appendToSheet,
  batchUpdateSheet,
  clearSheetRange,
} from "./googleSheetsService";

// Rango de la hoja donde se almacenan las bandas
const BAND_SHEET_RANGE = "'Bandas'!A:B"; // A para ID, B para Nombre
const RESERVATION_SHEET_RANGE = "'Reservas'!F:G"; // F para ID de la banda

/**
 * Agrega una nueva banda
 * @param name Nombre de la banda
 * @returns Objeto con la banda agregada
 */
export const addBand = async (name: string) => {
  const bandId = `B${uuidv4()}`;
  const bandName = name.toUpperCase();

  // Verificar si la banda ya existe
  const existingBands = await getBands();
  const exists = existingBands.some((band) => band.name === bandName);

  if (exists) {
    throw new Error("La banda ya existe");
  }

  // Agregar la nueva banda a la hoja
  await appendToSheet(BAND_SHEET_RANGE, [[bandId, bandName]]);

  return {
    id: bandId,
    name: bandName,
  };
};

/**
 * Elimina una banda y sus reservas asociadas
 * @param id ID de la banda
 * @returns Objeto indicando el éxito de la operación
 */
export const deleteBand = async (id: string) => {
  // Buscar la fila donde se encuentra la banda
  const rowIndex = await findBandRow(id);
  if (rowIndex === null) {
    throw new Error("Banda no encontrada");
  }

  // Eliminar la banda de la hoja
  await batchUpdateSheet([
    {
      deleteDimension: {
        range: {
          sheetId: 0, // ID de la hoja
          dimension: "ROWS",
          startIndex: rowIndex - 1, // La eliminación es cero indexada
          endIndex: rowIndex,
        },
      },
    },
  ]);

  // Eliminar las reservas asociadas a la banda
  await deleteBandReservations(id);

  return { success: true };
};

/**
 * Elimina todas las reservas asociadas a una banda
 * @param bandId ID de la banda
 */
const deleteBandReservations = async (bandId: string) => {
  const response = await getSheetValues(RESERVATION_SHEET_RANGE);
  const rows = response.slice(1); // Omitimos la primera fila (encabezados)

  // Recorremos cada fila buscando el bandId en la columna F
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row[0] === bandId) {
      // Si el bandId coincide
      const rowIndex = i + 2; // +2 porque omitimos encabezados y Google Sheets usa índice basado en 1
      // Limpiar las celdas de la fila de reservas
      await clearSheetRange(`'Reservas'!A${rowIndex}:G${rowIndex}`);
    }
  }
};

/**
 * Edita una banda existente (actualiza el nombre)
 * @param id ID de la banda
 * @param name Nuevo nombre de la banda
 * @returns Banda actualizada
 */
export const editBand = async (id: string, name: string) => {
  const rowIndex = await findBandRow(id);
  if (rowIndex === null) {
    throw new Error("Banda no encontrada");
  }

  // Actualizar el nombre de la banda en la columna B
  await updateSheetValues(`'Bandas'!B${rowIndex}`, [[name.toUpperCase()]]);

  return {
    id,
    name: name.toUpperCase(),
  };
};

/**
 * Obtiene todas las bandas
 * @returns Lista de bandas con su ID y nombre
 */
export const getBands = async (): Promise<{ id: string; name: string }[]> => {
  const rows = await getSheetValues("'Bandas'!A2:B"); // Desde la fila 2 para evitar el encabezado
  return rows.map((row) => ({
    id: row[0],
    name: row[1],
  }));
};

/**
 * Encuentra la fila de una banda por su ID
 * @param id ID de la banda
 * @returns Número de fila (índice basado en 1) o null si no se encuentra
 */
const findBandRow = async (id: string): Promise<number | null> => {
  const rows = await getSheetValues("'Bandas'!A:A");
  const rowIndex = rows.findIndex((row) => row[0] === id);
  return rowIndex >= 0 ? rowIndex + 1 : null; // Google Sheets usa indexación basada en 1
};
