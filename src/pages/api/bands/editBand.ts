import type { NextApiRequest, NextApiResponse } from "next";
import { editBand } from "@/services/bandService";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id, name } = req.body;
  if (!id || !name) {
    return res
      .status(400)
      .json({ error: "El ID y el nombre de la banda son requeridos" });
  }

  try {
    await editBand(id, name);
    res.status(200).json({ id, name: name.toLowerCase() });
  } catch (error) {
    const err = error as Error;
    console.error("Error al actualizar la banda:", err.message);
    res.status(500).json({ error: err.message });
  }
};
