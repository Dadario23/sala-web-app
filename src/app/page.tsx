"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Reemplaza la ruta actual con /home sin agregarla al historial
    router.replace("/home");
  }, [router]);

  return null; // No renderiza nada, ya que redirige inmediatamente
}
