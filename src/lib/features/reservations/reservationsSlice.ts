import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reservation } from "@/types/Reservation";

interface ReservationsState {
  data: Reservation[];
  lastFetched: string | null;
}

const initialState: ReservationsState = {
  data: [],
  lastFetched: null,
};

const reservationsSlice = createSlice({
  name: "reservations",
  initialState,
  reducers: {
    setReservations: (state, action: PayloadAction<Reservation[]>) => {
      state.data = action.payload.map((reservation) => ({
        ...reservation,
        bandId: reservation.bandId || null, // Asegurarte de que todas tengan bandId
      }));
      state.lastFetched = new Date().toISOString();
    },

    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.data.push(action.payload);
    },
    clearReservations: (state) => {
      state.data = [];
      state.lastFetched = null;
    },
    deleteReservation: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(
        (reservation) => reservation.reservationId !== action.payload
      );
    },

    updateReservation: (state, action: PayloadAction<Reservation>) => {
      const index = state.data.findIndex(
        (reservation) =>
          reservation.reservationId === action.payload.reservationId
      );
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    // Nueva acción para eliminar todas las reservas de una banda específica
    deleteReservationsByBand: (state, action: PayloadAction<string>) => {
      console.log("Band ID a eliminar:", action.payload);
      if (!state.data) {
        console.error("El estado de las reservas es nulo o indefinido");
        return;
      }
      console.log("Reservas antes de eliminar:", state.data);

      state.data = state.data.filter(
        (reservation) => reservation.bandId !== action.payload
      );

      console.log(
        "Reservas actualizadas después de eliminar la banda:",
        state.data
      );
    },
  },
});

// Exportamos las acciones
export const {
  setReservations,
  addReservation,
  clearReservations,
  deleteReservation,
  updateReservation,
  deleteReservationsByBand, // Nueva acción exportada
} = reservationsSlice.actions;

export const selectReservations = (state: {
  reservations: ReservationsState;
}) => state.reservations.data;

export const selectLastFetched = (state: { reservations: ReservationsState }) =>
  state.reservations.lastFetched;

export default reservationsSlice.reducer;
