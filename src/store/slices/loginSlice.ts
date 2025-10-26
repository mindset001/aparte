import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  error?: string;
}

const initialState: LoginState = {
  email: '',
  password: '',
  isLoading: false,
  error: undefined,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoginCredentials(state, action: PayloadAction<{ email: string; password: string }>) {
      state.email = action.payload.email;
      state.password = action.payload.password;
      console.log('Login credentials:', action.payload);
    },
    setLoginLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      console.log('Login loading:', action.payload);
    },
    setLoginError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
      console.log('Login error:', action.payload);
    },
    resetLogin(state) {
      state.email = '';
      state.password = '';
      state.isLoading = false;
      state.error = undefined;
      console.log('Login reset');
    },
  },
});

export const { setLoginCredentials, setLoginLoading, setLoginError, resetLogin } = loginSlice.actions;
export default loginSlice.reducer;
