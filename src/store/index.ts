import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Example slice (replace with your own slices)

import apartmentReducer from './slices/apartmentSlice';
import signupReducer from './slices/signupSlice';
import loginReducer from './slices/loginSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    apartment: apartmentReducer,
    signup: signupReducer,
    login: loginReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
