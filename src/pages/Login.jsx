import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '../lib/supabaseClient';
import { setAuth, setLoading } from '../store/slices/authSlice';
import { Mail, Lock, LogIn, Terminal, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    dispatch(setLoading(true));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      dispatch(setAuth({ user: data.user, session: data.session }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl -z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-white/40 p-10 z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group text-slate-500 hover:text-smit-blue transition-colors">
            <div className="p-2 bg-smit-blue/5 rounded-xl group-hover:bg-smit-blue/10 transition-colors">
               <ArrowLeft size={20} className="text-smit-blue" />
            </div>
            <span className="font-bold text-sm">Back to Home</span>
          </Link>
          <div className="mb-6">
            <img className="h-12 w-auto mx-auto" src="/src/assets/saylani-logo.png" alt="Saylani Logo" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Login to Portal</h2>
          <p className="text-slate-500 font-medium text-sm mt-3 text-center">
            Access your courses, dashboard, and educational resources.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-xl shadow-sm">
            <p className="text-sm text-red-700 font-bold">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-smit-blue transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-smit-blue/20 focus:border-smit-blue/50 transition-all"
                placeholder="email@address.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <a href="#" className="text-sm font-bold text-smit-blue hover:text-blue-700">Forgot?</a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-smit-blue transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-smit-blue/20 focus:border-smit-blue/50 transition-all"
                placeholder="Your secret password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-smit-blue hover:bg-[#003B75] text-white py-4 px-4 rounded-2xl font-extrabold text-lg transition-all shadow-xl shadow-smit-blue/20 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging In...
              </span>
            ) : (
              <>
                Login <LogIn size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
              <span className="bg-white px-4 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-3 rounded-xl transition-all font-bold text-slate-700">
              <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" className="w-5 h-5" alt="Google" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-[#111827] text-white py-3 rounded-xl transition-all font-bold">
              <Terminal size={20} />
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm font-bold text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-smit-blue hover:text-blue-700 underline decoration-2 underline-offset-4">
            Enroll Today
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
