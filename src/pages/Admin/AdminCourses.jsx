import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Plus, X, BookOpen, CheckCircle2, XCircle, Pencil } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

const EMPTY_FORM = { name: '', status: 'open' }

export default function AdminCourses() {
  const [courses, setCourses]     = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const fetchCourses = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setCourses(data || [])
    setIsLoading(false)
  }

  useEffect(() => { fetchCourses() }, [])

  const handleAddNew = () => {
    setEditingCourse(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowForm(true)
  }

  const handleEdit = (course) => {
    setEditingCourse(course)
    setForm({ name: course.name, status: course.status })
    setError('')
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Course name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update({ name: form.name.trim(), status: form.status })
          .eq('id', editingCourse.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('courses')
          .insert({ name: form.name.trim(), status: form.status })
        if (error) throw error
      }
      setShowForm(false)
      setEditingCourse(null)
      setForm(EMPTY_FORM)
      fetchCourses()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingCourse(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Course Management
            </h1>
            <p className="text-gray-500 mt-1">Add, edit, and manage course listings</p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-5 text-center">
            <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Courses</p>
          </Card>
          <Card className="p-5 text-center">
            <p className="text-3xl font-bold text-green-600">
              {courses.filter((c) => c.status === 'open').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Open</p>
          </Card>
          <Card className="p-5 text-center">
            <p className="text-3xl font-bold text-gray-400">
              {courses.filter((c) => c.status === 'closed').length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Closed</p>
          </Card>
        </div>

        {/* Courses Table */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Loading courses...</div>
        ) : courses.length === 0 ? (
          <Card className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No courses yet</h3>
            <p className="text-gray-400 mb-6">Click "Add Course" to create your first course</p>
            <Button onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">#</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Course Name</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Created</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-center">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses.map((course, index) => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-800">{course.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {course.status === 'open' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3" /> Open
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            <XCircle className="w-3 h-3" /> Closed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(course.created_at).toLocaleDateString('en-PK', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEdit(course)}
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                          title="Edit course"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              {editingCourse ? 'You can update the course name and status.' : 'Fill in the details to add a new course.'}
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Web & Mobile Development"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admission Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? 'Saving...' : editingCourse ? 'Save Changes' : 'Add Course'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}