import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../utils/supabaseClient'

const initialState = {
  leaves: [],
  isLoading: false,
  error: null,
}

export const submitLeave = createAsyncThunk('leaves/submitLeave', async ({ reason, fromDate, toDate, image }) => {
  let imageUrl = null
  if (image) {
    const { data } = await supabase.storage
      .from('leaves')
      .upload(`public/${Date.now()}.jpg`, image)
    imageUrl = supabase.storage.from('leaves').getPublicUrl(`public/${Date.now()}.jpg`).data.publicUrl
  }

  const { data, error } = await supabase.from('leaves').insert({
    student_id: supabase.auth.getUser().data.user.id, // Assume auth
    reason,
    from_date: fromDate,
    to_date: toDate,
    image_url: imageUrl,
  }).select().single()
  if (error) throw error
  return data
})

export const fetchLeaves = createAsyncThunk('leaves/fetchLeaves', async (filters = {}) => {
  let query = supabase.from('leaves').select('*')
  if (filters.studentId) query.eq('student_id', filters.studentId)
  if (filters.status) query.eq('status', filters.status)
  const { data, error } = await query
  if (error) throw error
  return data
})

export const updateLeaveStatus = createAsyncThunk('leaves/updateStatus', async ({ id, status }) => {
  const { data, error } = await supabase.from('leaves').update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data
})

const leavesSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitLeave.pending, (state) => { state.isLoading = true })
      .addCase(submitLeave.fulfilled, (state, action) => {
        state.isLoading = false
        state.leaves.push(action.payload)
      })
      // ... more cases
  },
})

export default leavesSlice.reducer

