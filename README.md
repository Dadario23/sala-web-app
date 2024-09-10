# AppWeb de Salas de Ensayo

Este proyecto es una aplicación web para la gestión de salas de ensayo, donde los administradores pueden agregar bandas y asociar reservas a las mismas. La app está desarrollada en **Next.js** y **TypeScript**, utilizando **Google Sheets** como base de datos.

## Características

- **Administración de Bandas**: Los administradores pueden crear, editar y eliminar bandas.
- **Gestión de Reservas**: Se pueden crear y gestionar reservas para las bandas.
- **Interfaz Minimalista**: Diseño simple y claro para facilitar la gestión de bandas y reservas.

## Tecnologías Utilizadas

- **Next.js**: Framework de React para aplicaciones de lado del servidor.
- **TypeScript**: Superset de JavaScript que añade tipado estático.
- **Google Sheets**: Utilizado como base de datos para almacenar información de bandas y reservas.
- **Styled Components/Tailwind CSS** (opcional): Para el manejo de estilos (según el setup de tu proyecto).

## Estructura de Carpetas

```bash
.
└── src/
    ├── app/
    │   ├── (header)/
    │   │   ├── bands/
    │   │   │   └── page.tsx
    │   │   ├── booking/
    │   │   │   └── page.tsx
    │   │   ├── home/
    │   │   │   └── page.tsx
    │   │   ├── reservations/
    │   │   │   └── page.tsx
    │   │   └── layouts.tsx
    │   ├── favicon.ico
    │   ├── layout.tsx
    │   └── page.tsx
    ├── assets/
    ├── components/
    │   ├── ui/
    │   ├── CardCalendar.tsx
    │   ├── ConfirmDeleteDialog.tsx
    │   ├── Header.tsx
    │   └── ThemeProvider.tsx
    ├── constants/
    │   └── sheets.ts
    ├── libs/
    ├── pages/
    │   └── api/
    │       ├── bands/
    │       │   ├── addBand.ts
    │       │   ├── deleteBand.ts
    │       │   ├── editBand.ts
    │       │   └── getBands.ts
    │       └── reservations/
    │           ├── addReservation.ts
    │           ├── deleteReservation.ts
    │           ├── getAllReservation.ts
    │           └── getReservations.ts
    ├── services/
    │   ├── backend/
    │   │   └── reservation/
    │   │       ├── addReservation.ts
    │   │       ├── deleteReservation.ts
    │   │       ├── findReservation.ts
    │   │       ├── getAllReservations.ts
    │   │       └── getReservations.ts
    │   ├── frontend/
    │   │   ├── fetchBands.ts
    │   │   └── fetchResertations.ts
    │   ├── bandService.ts
    │   └── googleSheetService.ts
    ├── styles/
    │   └── globals.css
    └── utils/
        ├── calculateAvailableTimes.ts
        ├── dateUtils.ts
        └── Reservations.ts
```

## API Endpoints

- `GET /api/bands/getBands`: Obtiene todas las bandas.
- `GET /api/reservations/getReservations`: Obtiene todas las reservas.
- `POST /api/bands/addBand`: Añade una nueva banda.
- `POST /api/reservations/addReservation`: Añade una nueva reserva.
- `DELETE /api/bands/deleteBand`: Elimina una banda.
- `DELETE /api/reservations/deleteReservation`: Elimina una reserva.
- `PUT /api/bands/editBand`: Edita la información de una banda.

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/usuario/nombre-repositorio.git
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Ejecutar la app en modo desarrollo:
   ```bash
   npm run dev
   ```

## Configuración

- **Google Sheets API**: Asegúrate de tener configurada la API de Google Sheets y proporcionar las credenciales necesarias en las variables de entorno para conectar la app con Google Sheets.

## Licencia

Este proyecto está bajo la licencia MIT.
