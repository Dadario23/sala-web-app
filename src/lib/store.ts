import { configureStore } from "@reduxjs/toolkit";
import reservationsReducer from "./features/reservations/reservationsSlice"; // Importamos el slice de reservas
import bandsReducer from "@/lib/features/bands/bandsSlice";

// Función para crear un store por request
export const makeStore = () => {
  return configureStore({
    reducer: {
      bands: bandsReducer,
      reservations: reservationsReducer,
    },
  });
};

// Inferimos el tipo de makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Inferimos el tipo RootState y AppDispatch del store
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
