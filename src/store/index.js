import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Supabase session objects which may contain non-serializable data
        ignoredActions: ['auth/setAuth'],
        ignoredPaths: ['auth.session', 'auth.user'],
      },
    }),
});
