import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllJobs, createJob } from '../api/jobAPI';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  return await getAllJobs();
});

export const postJob = createAsyncThunk('jobs/postJob', async (jobData) => {
  return await createJob(jobData);
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      });
  },
});

export default jobSlice.reducer;
