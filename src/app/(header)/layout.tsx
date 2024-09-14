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
      <div className="flex flex-col min-h-screen">
        <main className="flex flex-col flex-1 items-center">{children}</main>
        <Footer />
      </div>
    </>
  );
}
