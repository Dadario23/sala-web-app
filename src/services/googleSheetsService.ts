import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
console.log("SPREADSHEET ID", SPREADSHEET_ID);
const privateKey = process.env.GOOGLE_PRIVATE_KEY;
console.log("PRIVATE KEY", privateKey);

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
console.log("EMAIL", clientEmail);

if (!privateKey || !clientEmail || !SPREADSHEET_ID) {
  throw new Error(
    "Missing environment variables for Google API authentication"
  );
}

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

/**
 * Agrega valores a una hoja de Google Sheets
 */
export const appendToSheet = async (
  range: string,
  values: any[]
): Promise<void> => {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });
  } catch (error) {
    handleGoogleSheetsError(error, "agregar datos a la hoja");
  }
};

/**
 * Obtiene valores de una hoja de Google Sheets
 */
export const getSheetValues = async (range: string): Promise<any[]> => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });
    return response.data.values || [];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al obtener datos de la hoja: ${error.message}`);
    } else {
      throw new Error("Error desconocido al obtener datos de la hoja");
    }
  }
};

/**
 * Actualiza valores en una hoja de Google Sheets
 */
export const updateSheetValues = async (
  range: string,
  values: any[]
): Promise<void> => {
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });
  } catch (error) {
    handleGoogleSheetsError(error, "actualizar la hoja");
  }
};

/**
 * Realiza operaciones por lotes en una hoja de Google Sheets (como eliminar filas)
 */
export const batchUpdateSheet = async (requests: any[]) => {
  try {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error en la actualización por lotes: ${error.message}`);
    } else {
      throw new Error("Error desconocido en la actualización por lotes");
    }
  }
};

/**
 * Limpia un rango de la hoja de cálculo, vaciando las celdas del rango proporcionado
 */
export const clearSheetRange = async (range: string): Promise<void> => {
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al limpiar el rango: ${error.message}`);
    } else {
      throw new Error("Error desconocido al limpiar el rango");
    }
  }
};

/**
 * Manejo de errores para las operaciones de Google Sheets
 */
const handleGoogleSheetsError = (error: unknown, operation: string): never => {
  if (error instanceof Error) {
    throw new Error(`Error al ${operation}: ${error.message}`);
  } else {
    throw new Error(`Error desconocido al ${operation}`);
  }
};
