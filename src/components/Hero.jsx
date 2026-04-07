import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, PlayCircle, Star, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import heroMain from '../assets/hero_main.png';

const Hero = () => {
  return (
    <section className="relative bg-white pt-24 pb-20 lg:pt-32 lg:pb-36 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -z-10 hidden lg:block"></div>
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-smit-blue/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-smit-green/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-smit-blue/10 text-smit-blue px-4 py-2 rounded-full text-sm font-bold mb-8">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-smit-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-smit-blue"></span>
              </span>
              Now Accepting Enrollments for 2026
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-[#0f172a] leading-[1.1] mb-8">
              Building Pakistan's <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-smit-blue to-blue-400">
                Tech Future
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Changing lives through technology education. Join Pakistan's largest IT community getting high-quality free training from world-class industry experts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center">
              <Link to="/signup">
                <button className="group relative bg-smit-blue hover:bg-[#003B75] text-white px-10 py-5 rounded-full text-lg font-bold transition-all shadow-2xl shadow-smit-blue/20 hover:-translate-y-1 active:translate-y-0 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Enroll Now <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </Link>
              
              <Link to="/courses">
                <button className="flex items-center gap-3 text-[#0f172a] hover:text-smit-blue font-bold text-lg transition-colors group">
                  <div className="p-3 bg-white border border-slate-100 rounded-full shadow-md group-hover:shadow-lg transition-all group-hover:text-smit-blue">
                    <PlayCircle size={24} />
                  </div>
                  Learn More
                </button>
              </Link>
            </div>

            <div className="mt-16 flex flex-wrap justify-center lg:justify-start gap-8 border-t border-slate-100 pt-10">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-2 rounded-lg text-smit-blue">
                  <Users size={24} />
                </div>
                <div>
                   <div className="font-bold text-xl text-slate-900">500k+</div>
                   <div className="text-sm text-slate-500 font-medium">Students Trained</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-50 p-2 rounded-lg text-smit-green">
                  <Briefcase size={24} />
                </div>
                <div>
                   <div className="font-bold text-xl text-slate-900">100k+</div>
                   <div className="text-sm text-slate-500 font-medium">Placed in Jobs</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-yellow-50 p-2 rounded-lg text-yellow-500">
                  <Star size={24} />
                </div>
                <div>
                   <div className="font-bold text-xl text-slate-900">4.9/5</div>
                   <div className="text-sm text-slate-500 font-medium">Community Rating</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex-1 relative w-full"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border-8 border-white/30 backdrop-blur-sm">
               <img 
                 src={heroMain} 
                 alt="Students learning at SMIT" 
                 className="w-full h-auto aspect-[4/3] object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 flex items-end p-8">
                  <div className="text-white">
                    <div className="font-bold text-xl mb-1">Web Development Cohort 2026</div>
                    <div className="text-slate-200">Karachi Head Office Campus</div>
                  </div>
               </div>
            </div>

            {/* Floating UI Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute -top-10 -right-10 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 hidden sm:block"
            >
               <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-smit-green/20 rounded-xl flex items-center justify-center text-smit-green">
                    <StarsIcon />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Admissions Open</div>
                    <div className="text-sm text-slate-500">Apply before 20th May</div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Helper Icon
const StarsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

export default Hero;
