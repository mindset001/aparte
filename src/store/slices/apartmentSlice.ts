import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ApartmentState {
  apartments: Array<{
    id: string;
    title: string;
    location: string;
    price: string;
    status: string;
    image: string;
  }>;
}

const initialState: ApartmentState = {
  apartments: [],
};

const apartmentSlice = createSlice({
  name: 'apartment',
  initialState,
  reducers: {
    setApartments(state, action: PayloadAction<ApartmentState['apartments']>) {
      state.apartments = action.payload;
    },
    addApartment(state, action: PayloadAction<ApartmentState['apartments'][number]>) {
      state.apartments.push(action.payload);
    },
    // Add more reducers as needed
  },
});

export const { setApartments, addApartment } = apartmentSlice.actions;
export default apartmentSlice.reducer;
