import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './auth/authSlicer';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer
  }
});

export type RootStore = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch