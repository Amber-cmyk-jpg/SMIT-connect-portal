import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../features/courses/coursesSlice'
import CourseCard from '../components/CourseCard'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { Link } from 'react-router-dom'
import { Plus, Search, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient' 

const Courses = () => {
  const dispatch = useDispatch()
  const { courses, isLoading } = useSelector((state) => state.courses)
  const { role, user } = useSelector((state) => state.auth)

  const [selectedCourse, setSelectedCourse] = useState(null) 
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', cnic: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  const handleApply = (course) => {
    if (!user) {
      // Not logged in — redirect to login
      window.location.href = '/login'
      return
    }
    setSelectedCourse(course)
    setSubmitted(false)
    setFormData({ name: '', email: user?.email || '', phone: '', cnic: '' })
  }

  // ✅ NEW handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault()
  setSubmitting(true)
  try {
    const { error } = await supabase.from('applications').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      cnic: formData.cnic,
      course_id: selectedCourse.id,
      user_id: user.id,
    })
    if (error) throw error
    setSubmitted(true)
  } catch (err) {
    console.error(err)
  } finally {
    setSubmitting(false)
  }
}

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading courses...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50">
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header row */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                Available Courses
              </h1>
              <p className="text-xl text-gray-600">Find and apply for your desired program</p>
            </div>

            {/* Only show to admin */}
            {role === 'admin' && (
              <Link to="/admin/courses">
                <Button size="lg" className="hidden md:inline-flex px-8">
                  <Plus className="w-5 h-5 mr-2" />
                  Manage Courses
                </Button>
              </Link>
            )}
          </div>

          {/* Courses grid */}
          {courses.length === 0 ? (
            <Card className="text-center py-20">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No courses available</h3>
              <p className="text-gray-500 mb-8">Check back later for new admissions</p>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onApply={() => handleApply(course)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Apply Popup Modal ── */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">

            {/* Close button */}
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              /* Success state */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
                <p className="text-gray-500 mb-6">
                  Your application for <strong>{selectedCourse.name}</strong> has been received.
                </p>
                <Button onClick={() => setSelectedCourse(null)}>Close</Button>
              </div>
            ) : (
              /* Form state */
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-1">Apply for Course</h2>
                <p className="text-smit-blue font-semibold mb-6">{selectedCourse.name}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
                    <input
                      type="text"
                      required
                      value={formData.cnic}
                      onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="XXXXX-XXXXXXX-X"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Courses