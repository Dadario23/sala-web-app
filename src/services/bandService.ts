import { v4 as uuidv4 } from "uuid";
import {
  getSheetValues,
  updateSheetValues,
  appendToSheet,
  batchUpdateSheet,
  clearSheetRange,
} from "./googleSheetsService";


const BAND_SHEET_RANGE = "'Bandas'!A:B"; 
const RESERVATION_SHEET_RANGE = "'Reservas'!F:G"; 

/**
 * Agrega una nueva banda
 * @param name Nombre de la banda
 * @returns Objeto con la banda agregada
 */
export const addBand = async (name: string) => {
  const bandId = `B${uuidv4()}`;
  const bandName = name.toUpperCase();

  
  const existingBands = await getBands();
  const exists = existingBands.some((band) => band.name === bandName);

  if (exists) {
    throw new Error("La banda ya existe");
  }

  
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
  const rowIndex = await findBandRow(id);
  if (rowIndex === null) {
    throw new Error("Banda no encontrada");
  }

  
  await batchUpdateSheet([
    {
      deleteDimension: {
        range: {
          sheetId: 0, 
          dimension: "ROWS",
          startIndex: rowIndex - 1, 
          endIndex: rowIndex,
        },
      },
    },
  ]);

  
  await deleteBandReservations(id);

  return { success: true };
};

/**
 * Elimina todas las reservas asociadas a una banda
 * @param bandId ID de la banda
 */
const deleteBandReservations = async (bandId: string) => {
  const response = await getSheetValues(RESERVATION_SHEET_RANGE);
  const rows = response.slice(1); 

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row[0] === bandId) {
      // Si el bandId coincide
      const rowIndex = i + 2; 
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
  const rows = await getSheetValues("'Bandas'!A2:B"); 
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
  return rowIndex >= 0 ? rowIndex + 1 : null; 
};
