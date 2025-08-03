import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    selected: null,
  },
  reducers: {
    setCategory: (state, action) => {
      state.selected = action.payload;
    },
    clearCategory: state => {
      state.selected = null;
    },
  },
});

export const { setCategory, clearCategory } = categorySlice.actions;
export default categorySlice.reducer;
