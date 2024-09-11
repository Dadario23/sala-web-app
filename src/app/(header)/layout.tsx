import React from "react";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

export default function HeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center h-auto overflow-y-auto">
        {children}
      </div>
      <Footer />
      <Toaster />
    </>
  );
}
