"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import homeIcon from "../assets/home.svg";
import bookingIcon from "../assets/calendar-number-outline.svg";
import listReserve from "@/assets/list-outline.svg";
import bandsIcon from "@/assets/people-outline.svg";
export default function Header() {
  const router = useRouter();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleClick = (path: string) => {
    setIsNavOpen(false);
    router.push(path);
  };

  return (
    <div className="bg-white dark:bg-stone-900 shadow-lg">
      <div className="container mx-auto px-4 lg:px-20 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1
          className="text-2xl font-bold cursor-pointer text-black dark:text-white"
          onClick={() => handleClick("/home")}
        >
          SALA DE ENSAYO
        </h1>

        {/* Botón de menú hamburguesa solo visible en pantallas pequeñas */}
        <div className="lg:hidden">
          <div
            className="space-y-2 cursor-pointer"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <span className="block h-0.5 w-8 bg-white"></span>
            <span className="block h-0.5 w-8 bg-white"></span>
            <span className="block h-0.5 w-8 bg-white"></span>
          </div>
        </div>

        {/* Menú de navegación */}
        <div
          id="navigation"
          className={`lg:flex lg:items-center lg:space-x-8 absolute top-full left-0 right-0 bg-white dark:bg-stone-900 shadow-lg lg:shadow-none ${
            isNavOpen ? "block" : "hidden"
          } lg:static lg:block lg:space-y-0 space-y-4 mt-4 lg:mt-0`}
        >
          <a
            onClick={() => handleClick("/home")}
            className="transition-colors text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
          >
            <Image src={homeIcon} alt={"Home"} height={25} width={25} />
          </a>
          <a
            onClick={() => handleClick("/booking")}
            className="transition-colors text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
          >
            <Image src={bookingIcon} alt={"booking"} height={25} width={25} />
          </a>
          <a
            onClick={() => handleClick("/reservations")}
            className="transition-colors text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
          >
            <Image src={listReserve} alt={"booking"} height={25} width={25} />
          </a>
          <a
            onClick={() => handleClick("/bands")}
            className="transition-colors text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
          >
            <Image src={bandsIcon} alt={"bands"} height={25} width={25} />
          </a>
        </div>
      </div>

      <nav>
        <section className="MOBILE-MENU flex lg:hidden">
          {/* Menú desplegable móvil */}
          <div
            className={`${
              isNavOpen ? "flex" : "hidden"
            } fixed inset-0 bg-white dark:bg-stone-900 z-10 flex-col justify-evenly items-center`}
          >
            <div
              className="absolute top-0 right-0 px-8 py-8 cursor-pointer"
              onClick={() => setIsNavOpen(false)}
            >
              <svg
                className="h-8 w-8 text-gray-800"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <ul className="flex flex-col items-center justify-between min-h-[250px]">
              <li className="border-b border-gray-400 my-8 uppercase">
                <Link onClick={() => handleClick("/home")} href="/home">
                  Inicio
                </Link>
              </li>
              <li className="border-b border-gray-400 my-8 uppercase">
                <Link onClick={() => handleClick("/booking")} href="/booking">
                  Realizar reserva
                </Link>
              </li>
              <li className="border-b border-gray-400 my-8 uppercase">
                <Link
                  onClick={() => handleClick("/reservations")}
                  href="/reservations"
                >
                  Lista de reservas
                </Link>
              </li>
              <li className="border-b border-gray-400 my-8 uppercase">
                <Link onClick={() => handleClick("/bands")} href="/bands">
                  Bandas
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </nav>
    </div>
  );
}
