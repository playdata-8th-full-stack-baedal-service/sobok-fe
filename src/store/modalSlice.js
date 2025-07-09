import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    modalType: null,
    modalProps: {},
  },
  reducers: {
    openModal: (state, action) => {
      // action.payload가 string이면 기존 방식 유지
      if (typeof action.payload === 'string') {
        state.modalType = action.payload;
        state.modalProps = {};
      } else {
        // { type: 'YOUR_ID', props: { userId: 'kim123' } } 
        state.modalType = action.payload.type;
        state.modalProps = action.payload.props || {};
      }
    },
    closeModal: (state) => {
      state.modalType = null;
      state.modalProps = {}; //props 초기화
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
