import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Clock, Award, ShieldCheck, Settings, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const stats = [
    { label: "Enrolled Courses", value: "2", icon: <BookOpen className="text-blue-600" />, bg: "bg-blue-50" },
    { label: "Completed Modules", value: "14", icon: <GraduationCap className="text-green-600" />, bg: "bg-green-50" },
    { label: "Learning Hours", value: "128h", icon: <Clock className="text-purple-600" />, bg: "bg-purple-50" },
    { label: "Certificates Earned", value: "1", icon: <Award className="text-yellow-600" />, bg: "bg-yellow-50" },
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
                    Welcome Back, {user?.email?.split('@')[0]}
                  </h1>
                  <p className="text-blue-100/80 font-bold mt-2 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-smit-green" /> Student ID: #SMIT-2026-{Math.floor(Math.random() * 9000) + 1000}
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
          {/* Main Content: Courses */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                   <h3 className="text-xl font-extrabold text-slate-900">Enrolled Courses</h3>
                   <button className="text-smit-blue font-bold text-sm hover:underline">See All</button>
                </div>
                <div className="p-8 space-y-6">
                   {[
                     { title: "Web & Mobile Development", progress: 65, color: "bg-smit-blue", inst: "Sir Bilal Raza" },
                     { title: "Artificial Intelligence", progress: 20, color: "bg-smit-green", inst: "Dr. Rizwan" }
                   ].map((course, idx) => (
                    <div key={idx} className="group flex flex-col sm:flex-row gap-6 p-6 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-colors">
                       <div className={`w-full sm:w-24 h-24 rounded-2xl ${course.color} flex items-center justify-center shrink-0 shadow-lg shadow-${course.color}/10`}>
                          <BookOpen className="text-white" size={32} />
                       </div>
                       <div className="flex-grow flex flex-col justify-between">
                          <div className="flex items-start justify-between">
                             <div>
                                <h4 className="font-extrabold text-lg text-slate-900 mb-1">{course.title}</h4>
                                <p className="text-slate-500 font-bold text-sm">Instructor: {course.inst}</p>
                             </div>
                             <button className="p-2 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                <ExternalLink size={20} className="text-slate-400 group-hover:text-smit-blue" />
                             </button>
                          </div>
                          <div className="mt-4">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase">Overall Progress</span>
                                <span className="text-sm font-extrabold text-slate-900">{course.progress}%</span>
                             </div>
                             <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${course.progress}%` }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
                                  className={`h-full ${course.color} rounded-full`}
                                />
                             </div>
                          </div>
                       </div>
                    </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Sidebar: Announcements & Recommended */}
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
                        <div className="text-sm">Today, 25 October 2026</div>
                    </div>
                    <p className="font-bold text-slate-900 mb-2">Topic: Advance Redux Toolkit</p>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">Prepare your questions regarding state management and slice architecture.</p>
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

// Simple Icon
const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);

export default Dashboard;
