import Button from './ui/Button'
import Card from './ui/Card'
import { BookOpen, CheckCircle2, XCircle } from 'lucide-react'

// FIXED: removed useDispatch (not needed here), accept onApply prop
const CourseCard = ({ course, onApply }) => {
  const isOpen = course.status === 'open'

  return (
    <Card className="p-8 text-center group">
      <div className="w-20 h-20 bg-gradient-to-br from-smit-blue/20 to-smit-green/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
        <BookOpen className="w-10 h-10 text-smit-blue" />
      </div>

      <h3 className="text-2xl font-outfit font-bold text-smit-dark mb-4">{course.name}</h3>

      <div className="flex items-center justify-center mb-8">
        {isOpen ? (
          <div className="flex items-center text-smit-green">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span className="font-semibold">Admissions Open</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <XCircle className="w-5 h-5 mr-2" />
            <span>Admissions Closed</span>
          </div>
        )}
      </div>

      <Button
        onClick={onApply}      
        disabled={!isOpen}
        size="lg"
        className="w-full font-outfit text-lg px-8 py-4"
      >
        {isOpen ? 'Apply Now' : 'Coming Soon'}
      </Button>
    </Card>
  )
}

export default CourseCard