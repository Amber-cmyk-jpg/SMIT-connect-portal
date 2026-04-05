import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, User, LogOut, ChevronDown, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { clearAuth } from '../store/slices/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch(clearAuth());
    navigate('/');
  };

  return (
    <nav className="bg-smit-blue text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
              <img className="h-10 w-auto" src="/src/assets/saylani-logo.png" alt="Saylani Logo" />
              <span className="font-bold text-xl tracking-tight hidden md:block text-white">Connect Portal</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#003B75] transition-all">Home</Link>
                <div className="relative group cursor-pointer px-3 py-2 rounded-md text-sm font-medium hover:bg-[#003B75] flex items-center gap-1 transition-all">
                  Courses <ChevronDown size={14} />
                   <div className="absolute left-0 top-full pt-2 hidden group-hover:block translate-y-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <div className="bg-white text-gray-800 shadow-xl rounded-xl border border-gray-100 p-2 w-56 transform origin-top overflow-hidden">
                      <div className="p-3 border-b border-gray-50 flex items-center gap-2 text-smit-blue font-bold">
                        <BookOpen size={18} /> Available Courses
                      </div>
                      <Link to="/courses" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm transition-colors">Web Development</Link>
                      <Link to="/courses" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm transition-colors">Artificial Intelligence</Link>
                      <Link to="/courses" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm transition-colors">Mobile App Development</Link>
                      <Link to="/courses" className="block px-4 py-2 hover:bg-slate-50 rounded-lg text-sm transition-colors">UI/UX Design</Link>
                    </div>
                  </div>
                </div>
                <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#003B75] transition-all">About</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 gap-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#003B75] flex items-center gap-2 transition-all">
                    <User size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95">
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <Link to="/login" className="text-white hover:text-smit-green font-semibold transition-colors">Login</Link>
                  <Link to="/signup" className="bg-smit-green hover:bg-[#7DB53A] text-white px-8 py-3 rounded-full text-sm font-extrabold transition-all shadow-lg hover:shadow-smit-green/20 hover:-translate-y-1 active:translate-y-0">Enroll Now</Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#003B75] transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#004282] border-t border-blue-400 overflow-hidden transition-all duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium hover:bg-[#003B75]">Home</Link>
            <Link to="/courses" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium hover:bg-[#003B75]">Courses</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium hover:bg-[#003B75]">About</Link>
            {user ? (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-xl text-base font-medium hover:bg-[#003B75]">Dashboard</Link>
            ) : (
              <div className="pt-4 grid grid-cols-2 gap-4">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center p-3 border border-white/20 rounded-xl font-bold">Login</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="flex items-center justify-center p-3 bg-smit-green rounded-xl font-bold shadow-lg shadow-smit-green/20">Enroll</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
