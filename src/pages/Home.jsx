import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FBPosts from '../components/FBPosts';
import Button from '../components/ui/Button';
import { ArrowRight, LogIn, BookOpen, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <Hero />
      
      {/* CTA Buttons - SPEC: Student Login/Signup + New Courses */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            className="max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Join 500k+ students building real skills with SMIT's industry-leading programs
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch lg:items-center max-w-4xl mx-auto">
            {/* Student Login */}
            <Link to="/login" className="flex-1">
              <Button size="xl" className="w-full h-20 text-lg shadow-2xl hover:shadow-smit-blue/25 flex items-center justify-center gap-3 group">
                <LogIn className="w-7 h-7" />
                Student Login
                <ArrowRight className="w-6 h-6 ml-auto group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            
            {/* Signup */}
            <Link to="/signup" className="flex-1">
              <Button variant="outline" size="xl" className="w-full h-20 text-lg border-2 border-smit-blue hover:bg-smit-blue shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group">
                <UserPlus className="w-7 h-7" />
                New Student Signup
                <ArrowRight className="w-6 h-6 ml-auto group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            
            {/* New Courses */}
            <Link to="/courses" className="flex-1">
              <Button size="xl" className="w-full h-20 text-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/25 hover:shadow-emerald-600/40 flex items-center justify-center gap-3 group">
                <BookOpen className="w-7 h-7" />
                View New Courses
                <ArrowRight className="w-6 h-6 ml-auto group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50/50">
        <Features />
      </section>

      {/* SMIT Facebook Posts - SPEC REQUIREMENT */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FBPosts />
        </div>
      </section>
    </div>
  );
};

export default Home;

