import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SignupState {
  step: number;
  user: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
    [key: string]: any;
  };
}

const initialState: SignupState = {
  step: 1,
  user: {
    email: '',
    password: '',
    name: '',
    phone: '',
  },
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setSignupStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
      console.log('Signup step:', action.payload);
    },
    setSignupUser(state, action: PayloadAction<Partial<SignupState['user']>>) {
      state.user = { ...state.user, ...action.payload };
      console.log('Signup user:', state.user);
    },
    resetSignup(state) {
      state.step = 1;
      state.user = initialState.user;
      console.log('Signup reset');
    },
  },
});

export const { setSignupStep, setSignupUser, resetSignup } = signupSlice.actions;
export default signupSlice.reducer;
