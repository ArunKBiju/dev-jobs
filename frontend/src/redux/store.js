import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import jobReducer from './jobSlice';
import applicationReducer from './applicationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
  },
});

export default store;
