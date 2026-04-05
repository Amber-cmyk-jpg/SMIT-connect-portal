import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../utils/supabaseClient'

const initialState = {
  user: null,
  role: null,
  isLoading: false,
  error: null,
}

// Thunks
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, cnic, rollNo }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error

      if (data.user) {
        // Check if student exists in profiles, create profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('cnic', cnic)
          .single()

        if (!profile) {
          throw new Error('Student not found. Contact admin.')
        }

        await supabase.from('profiles').update({
          roll_no: rollNo
        }).eq('id', data.user.id)

        return { user: data.user, role: profile.role }
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const logIn = createAsyncThunk(
  'auth/logIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      return { user: data.user, role: profile?.role }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const logOut = createAsyncThunk('auth/logOut', async () => {
  await supabase.auth.signOut()
})

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  return { user: session.user, role: profile?.role }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.role = action.payload.role
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Similar for logIn, logOut, checkAuth...
      .addCase(logIn.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(logIn.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.role = action.payload.role
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = null
        state.role = null
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload?.user
        state.role = action.payload?.role
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer

