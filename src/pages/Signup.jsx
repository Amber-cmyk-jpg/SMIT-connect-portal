import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, Lock, UserPlus, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100/20 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-100/20 rounded-full blur-3xl -z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-white/40 p-12 z-10"
      >
        {!success ? (
          <>
            <div className="flex flex-col items-center mb-10 text-center">
              <Link to="/" className="inline-flex items-center gap-2 mb-8 group self-start">
                <div className="p-2 bg-smit-blue/5 rounded-xl group-hover:bg-smit-blue/10 transition-colors">
                   <ArrowLeft size={20} className="text-smit-blue" />
                </div>
                <span className="font-bold text-slate-500 text-sm">Cancel Enrollment</span>
              </Link>
            <div className="mb-6">
              <img className="h-16 w-auto mx-auto" src="/src/assets/saylani-logo.png" alt="Saylani Logo" />
            </div>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Enroll in SMIT</h2>
              <p className="text-slate-500 font-bold text-lg max-w-sm">
                Start your journey towards a successful IT career. High quality education for free.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-5 mb-8 rounded-2xl shadow-sm">
                <p className="text-sm text-red-700 font-extrabold">{error}</p>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSignup}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-smit-blue transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-12 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-3xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-smit-blue/10 focus:border-smit-blue/30 transition-all text-lg"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-smit-blue transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-12 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-3xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-smit-blue/10 focus:border-smit-blue/30 transition-all text-lg"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-smit-blue transition-colors">
                      <ShieldCheck size={20} />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-12 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-3xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-smit-blue/10 focus:border-smit-blue/30 transition-all text-lg"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-4">
                 <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    By enrolling, you agree to SMIT's Code of Conduct and regular attendance policies. Failure to maintain 75% attendance may lead to termination from the course.
                 </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-4 bg-smit-blue hover:bg-[#003B75] text-white py-5 px-6 rounded-3xl font-extrabold text-xl transition-all shadow-2xl shadow-smit-blue/20 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-75"
              >
                {isSubmitting ? "Registering..." : "Create Account"} <UserPlus size={24} />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-12 flex flex-col items-center">
             <div className="w-24 h-24 bg-green-50 text-smit-green rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-100">
                <CheckCircle2 size={48} />
             </div>
             <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Registration Successful!</h2>
             <p className="text-slate-500 font-bold text-lg mb-10 max-w-xs mx-auto leading-relaxed">
                Check your email to verify your account. Redirecting to login in a few seconds...
             </p>
             <Link to="/login" className="bg-smit-blue text-white px-10 py-4 rounded-full font-bold shadow-lg">
                Go to Login
             </Link>
          </div>
        )}

        <p className="mt-12 text-center text-sm font-bold text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-smit-blue hover:text-blue-700 underline decoration-2 underline-offset-4 font-extrabold">
            Login Here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
