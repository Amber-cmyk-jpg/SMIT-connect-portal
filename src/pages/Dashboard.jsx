import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Clock, Award, ShieldCheck, Settings, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // ✅ Real data from Supabase
  const [studentData, setStudentData]       = useState(null)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      setLoading(true)

      // Get student profile (roll number, name, etc.)
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setStudentData(student)

      // Get enrolled courses (applications they submitted)
      const { data: applications } = await supabase
        .from('applications')
        .select('*, courses(name, status)')
        .eq('user_id', user.id)
      setEnrolledCourses(applications || [])

      setLoading(false)
    }
    fetchData()
  }, [user])

  // ✅ Real stats from fetched data
  const stats = [
    {
      label: "Enrolled Courses",
      value: enrolledCourses.length,
      icon: <BookOpen className="text-blue-600" />,
      bg: "bg-blue-50"
    },
    {
      label: "Completed Modules",
      value: "—",   // you can add this later when you have a modules table
      icon: <GraduationCap className="text-green-600" />,
      bg: "bg-green-50"
    },
    {
      label: "Learning Hours",
      value: "—",   // you can add this later
      icon: <Clock className="text-purple-600" />,
      bg: "bg-purple-50"
    },
    {
      label: "Certificates Earned",
      value: "—",   // you can add this later
      icon: <Award className="text-yellow-600" />,
      bg: "bg-yellow-50"
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">

      {/* Top Header Section */}
      <div className="bg-smit-blue text-white pt-12 pb-24 shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-white/20 border-4 border-white/10 flex items-center justify-center text-3xl font-bold text-white shadow-xl backdrop-blur-md">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Welcome Back, {studentData?.name || user?.email?.split('@')[0]}
                </h1>
                {/* ✅ Real roll number instead of random number */}
                <p className="text-blue-100/80 font-bold mt-2 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-smit-green" />
                  {loading
                    ? 'Loading...'
                    : `Roll No: ${studentData?.roll_number || 'Not Assigned'}`
                  }
                </p>
              </div>
            </div>
            <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all border border-white/20 backdrop-blur-md">
              <Settings size={18} /> Edit Profile
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6"
            >
              <div className={`${stat.bg} p-4 rounded-xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content: Enrolled Courses */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-slate-900">Enrolled Courses</h3>
              </div>
              <div className="p-8 space-y-6">

                {/* ✅ Real courses from Supabase */}
                {loading ? (
                  <p className="text-gray-400 text-center py-8">Loading your courses...</p>
                ) : enrolledCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-semibold">No courses enrolled yet</p>
                    <p className="text-gray-400 text-sm mt-1">Go to Courses page and apply!</p>
                  </div>
                ) : (
                  enrolledCourses.map((application, idx) => (
                    <div key={idx} className="group flex flex-col sm:flex-row gap-6 p-6 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-colors">
                      <div className="w-full sm:w-24 h-24 rounded-2xl bg-smit-blue flex items-center justify-center shrink-0 shadow-lg">
                        <BookOpen className="text-white" size={32} />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div>
                            {/* ✅ Real course name */}
                            <h4 className="font-extrabold text-lg text-slate-900 mb-1">
                              {application.courses?.name || 'Course'}
                            </h4>
                            {/* ✅ Real application status */}
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                              application.courses?.status === 'open'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {application.courses?.status === 'open' ? 'Admissions Open' : 'Admissions Closed'}
                            </span>
                          </div>
                          <button className="p-2 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                            <ExternalLink size={20} className="text-slate-400 group-hover:text-smit-blue" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl shadow-smit-blue/5 border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 bg-slate-900 text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-smit-green/20 rounded-xl flex items-center justify-center text-smit-green">
                  <Award size={20} />
                </div>
                <h3 className="font-extrabold text-lg">Next Live Session</h3>
              </div>
              <div className="p-8">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-6 font-bold text-slate-700">
                  <div className="text-2xl text-smit-blue font-extrabold mb-1">08:00 PM</div>
                  <div className="text-sm">Check your schedule</div>
                </div>
                <p className="font-bold text-slate-900 mb-2">Topic: Advance Redux Toolkit</p>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">Prepare your questions regarding state management.</p>
                <button className="w-full bg-smit-green hover:bg-[#7DB53A] text-white py-4 rounded-2xl font-extrabold transition-all shadow-lg shadow-smit-green/20">
                  Join Zoom Class
                </button>
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <h4 className="text-xl font-bold mb-4">SMIT Job Board</h4>
              <p className="text-slate-400 text-sm font-medium mb-8">Get exclusive access to career opportunities from our partners.</p>
              <button className="flex items-center gap-2 text-smit-green font-extrabold text-sm hover:underline">
                Explore Partners <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;