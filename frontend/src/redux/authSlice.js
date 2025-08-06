import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, getCurrentUser } from '../api/authAPI';

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    return await loginUser(credentials);
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Login failed';
    return thunkAPI.rejectWithValue(message);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    return await registerUser(userData);
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Registration failed';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState()?.auth?.token;
    return await getCurrentUser(token);
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Fetch user failed';
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
