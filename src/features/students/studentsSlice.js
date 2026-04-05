import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../utils/supabaseClient'

const initialState = {
  students: [],
  isLoading: false,
  error: null,
}

export const uploadStudentsExcel = createAsyncThunk('students/uploadExcel', async (file) => {
  // Simple CSV-like parse (add xlsx dep if needed, or use PapaParse CDN)
  const text = await file.text()
  const rows = text.split('\n').slice(1).map(row => {
    const [cnic, rollNo, name, email] = row.split(',')
    return { cnic, roll_no: rollNo, name, email }
  })

  const { data, error } = await supabase.from('profiles').upsert(rows.map(s => ({
    id: `student-${s.cnic}`, // temp id, update on signup?
    cnic: s.cnic,
    roll_no: s.roll_no,
    role: 'student'
  })), { onConflict: 'cnic' })
  if (error) throw error
  return data
})

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadStudentsExcel.fulfilled, (state, action) => {
        state.students = action.payload
      })
  },
})

export default studentsSlice.reducer

