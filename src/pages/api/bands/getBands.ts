import type { NextApiRequest, NextApiResponse } from "next";
import { getBands } from "@/services/bandService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const bands = await getBands();
    res.status(200).json(bands);
  } catch (error) {
    const err = error as Error;
    console.error("Error al obtener bandas:", err.message);
    res.status(500).json({ error: err.message });
  }
};
