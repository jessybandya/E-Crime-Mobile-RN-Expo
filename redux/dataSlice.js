import { createSlice } from "@reduxjs/toolkit";

export const DataSlice = createSlice({
  name: "nav",
  initialState: {
    authId: "",
  },
  reducers: {
    updateAuthId: (state, action) => {
      state.authId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateAuthId } = DataSlice.actions;

export const updateAuthIdVar = (state) => state.nav.authId;

export default DataSlice.reducer;
