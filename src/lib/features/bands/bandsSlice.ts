// src/lib/features/bands/bandsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";

interface Band {
  id: string;
  name: string;
}

interface BandsState {
  bands: Band[];
}

const initialState: BandsState = {
  bands: [],
};

const bandsSlice = createSlice({
  name: "bands",
  initialState,
  reducers: {
    setBands: (state, action: PayloadAction<Band[]>) => {
      state.bands = action.payload;
    },
  },
});

export const { setBands } = bandsSlice.actions;
export const selectBands = (state: RootState) => state.bands.bands;
export default bandsSlice.reducer;
