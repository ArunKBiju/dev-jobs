import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { submitApplication, getUserApplications } from '../api/applicationAPI';

export const applyToJob = createAsyncThunk('applications/apply', async (data) => {
  return await submitApplication(data);
});

export const fetchUserApplications = createAsyncThunk('applications/fetchUser', async () => {
  return await getUserApplications();
});

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    applications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchUserApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default applicationSlice.reducer;
