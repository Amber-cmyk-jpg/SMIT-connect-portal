import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabaseClient'

// ── Async thunk for login ─────────────────────────────
export const logIn = createAsyncThunk('auth/logIn', async ({ email, password }, thunkAPI) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return thunkAPI.rejectWithValue(error.message)

  // Check role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  return { user: data.user, session: data.session, role: profile?.role || 'student' }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    session: null,
    role: null,
    loading: true,
    isLoading: false,
    error: null,
  },
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user
      state.session = action.payload.session
      state.loading = false
    },
    clearAuth: (state) => {
      state.user = null
      state.session = null
      state.role = null
      state.loading = false
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.session = action.payload.session
        state.role = action.payload.role
        state.error = null
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { setAuth, clearAuth, setLoading, clearError } = authSlice.actions
export default authSlice.reducer