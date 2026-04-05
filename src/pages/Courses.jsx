import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../features/courses/coursesSlice'
import Header from '../components/Header'
import CourseCard from '../components/CourseCard'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import { Plus, Search } from 'lucide-react'

const Courses = () => {
  const dispatch = useDispatch()
  const { courses, isLoading } = useSelector((state) => state.courses)

  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading courses...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50">
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-outfit font-bold text-smit-dark mb-2">
                Available Courses
              </h1>
              <p className="text-xl text-gray-600 font-outfit">Find and apply for your desired program</p>
            </div>
            <Link to="/admin/courses">
              <Button size="lg" className="hidden md:inline-flex px-8">
                <Plus className="w-5 h-5 mr-2" />
                Manage Courses
              </Button>
            </Link>
          </div>

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
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Courses

