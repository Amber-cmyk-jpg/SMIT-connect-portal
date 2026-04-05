import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../utils/supabaseClient'

const initialState = {
  courses: [],
  isLoading: false,
  error: null,
}

export const fetchCourses = createAsyncThunk('courses/fetchCourses', async () => {
  const { data, error } = await supabase.from('courses').select('*')
  if (error) throw error
  return data
})

export const addCourse = createAsyncThunk('courses/addCourse', async (course) => {
  const { data, error } = await supabase.from('courses').insert(course).select().single()
  if (error) throw error
  return data
})

export const updateCourse = createAsyncThunk('courses/updateCourse', async ({ id, ...updates }) => {
  const { data, error } = await supabase.from('courses').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
})

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false
        state.courses = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
      // Add similar cases for addCourse, updateCourse...
  },
})

export default coursesSlice.reducer

