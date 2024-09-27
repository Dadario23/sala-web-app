import React from "react";
import { Github } from "@geist-ui/icons";
import logoWhatsapp from "@/assets/logo-whatsapp.svg";
import Image from "next/image";
const Footer = () => {
  return (
    <footer className="dark:bg-stone-900 text-white py-4 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Creado por Darío Andrada. Todos los
          derechos reservados.
        </p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a
            href="mailto:dandrada23@gmail.com"
            className="text-sm hover:underline"
          >
            Contacto: dandrada23@gmail.com
          </a>
          {/* <a
            href=""
            className="text-sm hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Portafolio
          </a>

          <Image src={logoWhatsapp} alt="logo-whatsapp" className="w-5" />
          <a
            href="https://github.com/Dadario23"
            className="text-sm hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={16} />
          </a> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
