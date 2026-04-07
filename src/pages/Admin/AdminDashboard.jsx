import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { supabase } from '../../lib/supabaseClient'
import { Users, BookOpen, FileText, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import Card from '../../components/ui/Card'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)

      const [
        { count: totalStudents },
        { count: totalCourses },
        { count: pendingLeaves },
        { count: approvedLeaves },
        { count: rejectedLeaves },
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('leaves').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('leaves').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('leaves').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
      ])

      setStats({
        totalStudents: totalStudents || 0,
        totalCourses: totalCourses || 0,
        pendingLeaves: pendingLeaves || 0,
        approvedLeaves: approvedLeaves || 0,
        rejectedLeaves: rejectedLeaves || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  const navCards = [
    {
      title: 'Student Management',
      description: 'Upload students via Excel. Only uploaded students can register.',
      icon: <Users className="w-8 h-8 text-blue-600" />,
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      stat: stats.totalStudents,
      statLabel: 'Total Students',
      path: '/admin/students',
    },
    {
      title: 'Course Management',
      description: 'Add, edit, and manage course listings and admission status.',
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      bg: 'bg-green-50',
      border: 'border-green-100',
      stat: stats.totalCourses,
      statLabel: 'Total Courses',
      path: '/admin/courses',
    },
    {
      title: 'Leave Management',
      description: 'Review and approve or reject student leave requests.',
      icon: <FileText className="w-8 h-8 text-orange-500" />,
      bg: 'bg-orange-50',
      border: 'border-orange-100',
      stat: stats.pendingLeaves,
      statLabel: 'Pending Requests',
      path: '/admin/leaves',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, Admin 👋
          </h1>
          <p className="text-gray-500 mt-1">
            {user?.email} — Here's an overview of the portal
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Students',  value: stats.totalStudents,  color: 'text-blue-600',   bg: 'bg-blue-50'   },
            { label: 'Courses',   value: stats.totalCourses,   color: 'text-green-600',  bg: 'bg-green-50'  },
            { label: 'Pending',   value: stats.pendingLeaves,  color: 'text-yellow-600', bg: 'bg-yellow-50',
              icon: <Clock className="w-4 h-4" /> },
            { label: 'Approved',  value: stats.approvedLeaves, color: 'text-green-600',  bg: 'bg-green-50',
              icon: <CheckCircle2 className="w-4 h-4" /> },
            { label: 'Rejected',  value: stats.rejectedLeaves, color: 'text-red-600',    bg: 'bg-red-50',
              icon: <XCircle className="w-4 h-4" /> },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`${s.bg} rounded-2xl p-5 text-center`}
            >
              {s.icon && (
                <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
              )}
              <p className={`text-3xl font-bold ${s.color}`}>
                {loading ? '—' : s.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {navCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Card
                className={`p-6 border ${card.border} cursor-pointer hover:shadow-lg transition-all group`}
                onClick={() => navigate(card.path)}
              >
                <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center mb-5`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 mb-5">{card.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {loading ? '—' : card.stat}
                    </p>
                    <p className="text-xs text-gray-400">{card.statLabel}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors">
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Links - ENHANCED */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card
              className="p-8 group cursor-pointer hover:shadow-2xl hover:shadow-purple-500/10 border border-purple-100 bg-gradient-to-r from-purple-50/50 hover:from-purple-50 bg-blend-overlay relative overflow-hidden hover:bg-purple-50 transition-all duration-500"
              onClick={() => navigate('/admin/add-admin')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/50 rounded-bl-full blur-xl -mr-20 -mt-20 group-hover:bg-purple-200/60 transition-all"></div>
              <div className="w-16 h-16 bg-purple-500/10 border-2 border-purple-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-all">
                <Users className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-700 transition-colors">Add New Admin</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">Create additional admin accounts for team management</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-600 group-hover:text-purple-700">Team Management</span>
                <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-purple-600 ml-auto group-hover:translate-x-2 transition-all" />
              </div>
            </Card>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card
              className="p-8 group cursor-pointer hover:shadow-2xl hover:shadow-red-500/10 border border-red-100 bg-gradient-to-r from-red-50/50 hover:from-red-50 bg-blend-overlay relative overflow-hidden hover:bg-red-50 transition-all duration-500"
              onClick={() => navigate('/admin/reset-password')}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/50 rounded-bl-full blur-xl -mr-20 -mt-20 group-hover:bg-red-200/60 transition-all"></div>
              <div className="w-16 h-16 bg-red-500/10 border-2 border-red-200 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-all">
                <Lock className="w-8 h-8 text-red-600 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-700 transition-colors">Reset Password</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">Securely update your admin account password</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-600 group-hover:text-red-700">Account Security</span>
                <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-red-600 ml-auto group-hover:translate-x-2 transition-all" />
              </div>
            </Card>
          </motion.div>
        </div>

      </div>
    </div>
  )
}