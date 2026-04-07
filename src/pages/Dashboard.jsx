import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Clock, Award, ShieldCheck, Settings, ExternalLink, ArrowRight, Rocket, Bell, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// Skeleton pulse loader
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

const statusConfig = {
  pending:  { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700', icon: <AlertCircle size={14} /> },
  approved: { label: 'Approved',       color: 'bg-green-100 text-green-700',  icon: <CheckCircle size={14} /> },
  rejected: { label: 'Rejected',       color: 'bg-red-100 text-red-700',      icon: <XCircle size={14} />    },
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [studentData, setStudentData]         = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);

      const { data: student } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setStudentData(student);

      const { data: applications } = await supabase
        .from('applications')
        .select('*, courses(name, status, description)')
        .eq('user_id', user.id);
      setEnrolledCourses(applications || []);

      setLoading(false);
    };
    fetchData();
  }, [user]);

  const displayName = studentData?.name || user?.email?.split('@')[0] || 'Student';
  const rollNo      = studentData?.roll_no;
  const initials    = displayName.charAt(0).toUpperCase();

  const stats = [
    { label: 'Enrolled Courses', value: loading ? null : enrolledCourses.length, icon: <BookOpen className="text-blue-600" size={22} />, bg: 'from-blue-50 to-blue-100/60',   num: 'text-blue-700'   },
    { label: 'Completed Modules', value: loading ? null : 0,                      icon: <GraduationCap className="text-emerald-600" size={22} />, bg: 'from-emerald-50 to-emerald-100/60', num: 'text-emerald-700' },
    { label: 'Learning Hours',    value: loading ? null : 0,                      icon: <Clock className="text-purple-600" size={22} />, bg: 'from-purple-50 to-purple-100/60', num: 'text-purple-700'  },
    { label: 'Certificates',      value: loading ? null : 0,                      icon: <Award className="text-amber-600" size={22} />, bg: 'from-amber-50 to-amber-100/60',   num: 'text-amber-700'  },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-20">

      {/* ── Hero Header ── */}
      <div className="bg-smit-blue text-white pt-10 pb-28 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-smit-green/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            {/* Avatar + Name */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white/30 to-white/10 border-4 border-white/20 flex items-center justify-center text-3xl font-black text-white shadow-2xl backdrop-blur-md">
                {initials}
              </div>
              <div>
                <p className="text-blue-200 text-sm font-semibold mb-1 tracking-wide uppercase">Student Dashboard</p>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Welcome Back, <span className="text-smit-green">{displayName}</span>
                </h1>
                <p className="text-blue-200/80 font-semibold mt-2 flex items-center gap-2 text-sm">
                  <ShieldCheck size={16} className="text-smit-green" />
                  {loading
                    ? <span className="animate-pulse">Loading profile…</span>
                    : rollNo
                      ? `Roll No: ${rollNo}`
                      : <span className="text-yellow-300/90">Roll No not assigned yet — contact admin</span>
                  }
                </p>
              </div>
            </div>

            <button className="self-start md:self-auto bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all border border-white/20 backdrop-blur-md">
              <Settings size={17} /> Edit Profile
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`bg-gradient-to-br ${stat.bg} p-5 rounded-2xl shadow-sm border border-white flex items-center gap-4`}
            >
              <div className="p-3 bg-white rounded-xl shadow-sm">
                {stat.icon}
              </div>
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider leading-tight mb-1">{stat.label}</p>
                {stat.value === null
                  ? <Skeleton className="h-7 w-10" />
                  : <p className={`text-2xl font-black ${stat.num}`}>{stat.value}</p>
                }
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Main + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Enrolled Courses */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-900">My Enrolled Courses</h3>
                <Link to="/courses" className="text-smit-blue text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                  Browse Courses <ArrowRight size={16} />
                </Link>
              </div>

              <div className="p-6 space-y-4">
                {/* Loading skeleton */}
                {loading && (
                  <div className="space-y-4">
                    {[0, 1].map(i => (
                      <div key={i} className="flex gap-4 p-5 border border-slate-100 rounded-2xl">
                        <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {!loading && enrolledCourses.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-14 px-6"
                  >
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-5">
                      <BookOpen className="text-smit-blue" size={36} />
                    </div>
                    <h4 className="text-xl font-extrabold text-slate-800 mb-2">No Courses Yet</h4>
                    <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-6">
                      You haven't enrolled in any course yet. Browse our available programs and apply today — it's completely free!
                    </p>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 bg-smit-blue hover:bg-[#003B75] text-white px-7 py-3 rounded-full font-bold text-sm transition-all shadow-lg shadow-smit-blue/20 hover:-translate-y-0.5"
                    >
                      <Rocket size={16} /> Explore Courses
                    </Link>
                  </motion.div>
                )}

                {/* Course cards */}
                {!loading && enrolledCourses.map((app, idx) => {
                  const s = statusConfig[app.status] || statusConfig.pending;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      className="group flex gap-5 p-5 border border-slate-100 rounded-2xl hover:border-smit-blue/20 hover:bg-blue-50/30 transition-all"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-smit-blue flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                        <BookOpen className="text-white" size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-extrabold text-base text-slate-900 mb-1">{app.courses?.name || 'Course'}</h4>
                            {app.courses?.description && (
                              <p className="text-slate-400 text-xs line-clamp-1">{app.courses.description}</p>
                            )}
                          </div>
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full shrink-0 ${s.color}`}>
                            {s.icon} {s.label}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Live Session Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 bg-slate-900 text-white flex items-center gap-3">
                <div className="w-9 h-9 bg-smit-green/20 rounded-xl flex items-center justify-center text-smit-green">
                  <Bell size={18} />
                </div>
                <h3 className="font-extrabold">Next Live Session</h3>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-br from-blue-50 to-smit-blue/5 p-5 rounded-2xl border border-blue-100 mb-5">
                  <div className="text-3xl text-smit-blue font-black mb-0.5">08:00 PM</div>
                  <div className="text-slate-500 text-sm font-semibold">Tonight's Session</div>
                </div>
                <p className="font-bold text-slate-900 mb-1 text-sm">Topic: Advance Redux Toolkit</p>
                <p className="text-slate-400 text-xs mb-5 leading-relaxed">Prepare your questions regarding state management and async thunks.</p>
                <button className="w-full bg-smit-green hover:bg-[#7DB53A] text-white py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-lg shadow-smit-green/20 hover:-translate-y-0.5">
                  Join Zoom Class
                </button>
              </div>
            </div>

            {/* Job Board Card */}
            <div className="bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden group">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-smit-blue/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-smit-green/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-smit-green/20 rounded-xl flex items-center justify-center text-smit-green mb-4">
                  <Rocket size={20} />
                </div>
                <h4 className="text-lg font-extrabold mb-2">SMIT Job Board</h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">Get exclusive access to career opportunities from our 200+ industry partners.</p>
                <button className="flex items-center gap-2 text-smit-green font-extrabold text-sm hover:gap-3 transition-all">
                  Explore Partners <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;