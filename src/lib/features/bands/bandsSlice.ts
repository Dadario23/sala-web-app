import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { Band } from "@/types/band";

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
