import { createSlice, PayloadAction } from '@reduxjs/toolkit';

function saveAuthToStorage(state: AuthState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth', JSON.stringify(state));
  }
}
function getAuthFromStorage(): AuthState | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('auth');
    if (data) return JSON.parse(data);
  }
  return null;
}

export interface AuthState {
  user: {
    uuid?: string;
    fullName?: string;
    email?: string;
    userType?: string;
    picture?: string;
    [key: string]: any;
  } | null;
  token?: string;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
}

const initialState: AuthState = getAuthFromStorage() || {
  user: null,
  token: undefined,
  isAuthenticated: false,
  loading: false,
  error: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = undefined;
    },
    authSuccess(state, action: PayloadAction<{ user: any; token?: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = undefined;
      saveAuthToStorage(state);
    },
    authFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
      state.isAuthenticated = false;
      saveAuthToStorage(state);
    },
    logout(state) {
      state.user = null;
      state.token = undefined;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = undefined;
      saveAuthToStorage(state);
    },
    hydrateAuth(state, action: PayloadAction<AuthState>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { authStart, authSuccess, authFailure, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
