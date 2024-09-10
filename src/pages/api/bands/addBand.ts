import type { NextApiRequest, NextApiResponse } from "next";
import { addBand } from "@/services/bandService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ error: "El nombre de la banda es requerido" });
  }

  try {
    const newBand = await addBand(name);
    res.status(201).json(newBand);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error al agregar la banda:", error.message);
      res
        .status(500)
        .json({ error: error.message || "Error al agregar la banda" });
    } else {
      console.error("Unknown error occurred:", error);
      res.status(500).json({ error: "Error al agregar la banda" });
    }
  }
};
