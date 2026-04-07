import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../utils/supabaseClient'

const initialState = {
  user: null,
  role: null,
  isLoading: false,
  error: null,
}

// ─── Thunks ───────────────────────────────────────────────

// FIXED: Validates CNIC + RollNo together, then links auth user to existing profile
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, cnic, rollNo }, { rejectWithValue }) => {
    try {
      // Step 1: Check if student was pre-added by admin (CNIC + Roll No must both match)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('cnic', cnic)
        .eq('roll_no', rollNo)
        .is('user_id', null) // not already registered
        .single()

      if (profileError || !profile) {
        throw new Error('Student not found. Please contact admin.')
      }

      // Step 2: Create the auth user
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error

      // Step 3: Link the auth user to the existing profile row
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_id: data.user.id, email })
        .eq('id', profile.id)

      if (updateError) throw updateError

      return { user: data.user, role: profile.role ?? 'student' }
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

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id) // FIXED: use user_id column, not id
        .single()

      if (profileError) throw new Error('Profile not found.')

      return { user: data.user, role: profile.role }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const logOut = createAsyncThunk('auth/logOut', async (_, { rejectWithValue }) => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id) // FIXED: use user_id column
      .single()

    return { user: session.user, role: profile?.role ?? null }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

// ─── Slice ────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null },

    // ADDED: These are used by App.jsx's onAuthStateChange listener
    setAuth: (state, action) => {
      state.user = action.payload.user
      state.role = action.payload.role ?? null
      state.isLoading = false
    },
    clearAuth: (state) => {
      state.user = null
      state.role = null
      state.isLoading = false
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // signUp
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

      // logIn
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

      // logOut
      .addCase(logOut.pending, (state) => { state.isLoading = true })
      .addCase(logOut.fulfilled, (state) => {
        state.user = null
        state.role = null
        state.isLoading = false
        state.error = null
      })
      .addCase(logOut.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // checkAuth — FIXED: handles null payload + sets isLoading
      .addCase(checkAuth.pending, (state) => { state.isLoading = true })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload?.user ?? null
        state.role = action.payload?.role ?? null
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.role = null
      })
  },
})

export const { clearError, setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer