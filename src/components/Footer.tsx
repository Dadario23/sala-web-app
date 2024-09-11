import React from "react";

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
          <a href="https://tuperfil.com" className="text-sm hover:underline">
            Portafolio
          </a>
          {/* Puedes agregar tus redes sociales */}
          <a
            href="https://github.com/Dadario23"
            className="text-sm hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
