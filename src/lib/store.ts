import { configureStore } from "@reduxjs/toolkit";
import reservationsReducer from "./features/reservations/reservationsSlice";
import bandsReducer from "@/lib/features/bands/bandsSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      bands: bandsReducer,
      reservations: reservationsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
