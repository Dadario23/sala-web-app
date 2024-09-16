import type { NextApiRequest, NextApiResponse } from "next";
import { deleteBand } from "@/services/bandService"; 

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "El ID de la banda es requerido" });
  }

  try {
    
    await deleteBand(id);
    res
      .status(200)
      .json({ message: "Banda y sus reservas eliminadas exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la banda:", error);
    res.status(500).json({ error: "Error al eliminar la banda" });
  }
};
