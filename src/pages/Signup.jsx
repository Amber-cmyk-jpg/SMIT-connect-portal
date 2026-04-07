import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../features/auth/authSlice';
import { Mail, Lock, Hash, User, UserPlus, ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/saylani-logo.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    cnic: '',
    rollNo: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useDispatch();
  const { isLoading: authLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!formData.cnic || !formData.rollNo) {
      setError("CNIC and Roll Number are required. Contact admin if not added.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await dispatch(signUp({
        email: formData.email,
        password: formData.password,
        cnic: formData.cnic.trim(),
        rollNo: formData.rollNo.trim()
      })).unwrap();

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err || 'Signup failed. Only admin-approved students can register.');
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
        className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-white/40 p-12 z-10"
      >
        {!success ? (
          <>
            <div className="text-center mb-10">
              <Link to="/" className="inline-flex items-center gap-2 mb-8 group self-start">
                <div className="p-2 bg-smit-blue/5 rounded-xl group-hover:bg-smit-blue/10 transition-colors">
                  <ArrowLeft size={20} className="text-smit-blue" />
                </div>
                <span className="font-bold text-slate-500 text-sm">Cancel Enrollment</span>
              </Link>
              <div className="mb-6">
                <img className="h-16 w-auto mx-auto" src={logo} alt="Saylani Logo" />
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Student Registration</h2>
              <p className="text-slate-500 font-bold text-lg max-w-sm mx-auto">
                Only students added by admin can register. Use your CNIC & Roll Number.
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border-l-4 border-red-500 p-5 mb-8 rounded-2xl shadow-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700 font-extrabold">{error}</p>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSignup}>
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1">
                  <Mail size={16} /> Email Address
                </label>
                <div className="relative group">
                  <input
                    name="email"
                    type="email"
                    required
                    className="block w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-smit-blue/10 focus:border-smit-blue/30 transition-all text-lg"
                    placeholder="student@smit.edu.pk"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* CNIC + RollNo Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1">
                    <Hash size={16} /> CNIC <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      name="cnic"
                      type="text"
                      required
                      maxLength={15}
                      className="block w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-smit-blue/10 focus:border-smit-blue/30 transition-all text-lg"
                      placeholder="42101-1234567-1"
                      value={formData.cnic}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Must match admin-uploaded record</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1">
                    <User size={16} /> Roll Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      name="rollNo"
                      type="text"
                      required
                      className="block w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-smit-blue/10 focus:border-smit-blue/30 transition-all text-lg"
                      placeholder="SMIT-2024-001"
                      value={formData.rollNo}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Exact Roll No from admin Excel</p>
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1">
                    <Lock size={16} /> Password
                  </label>
                  <div className="relative group">
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      className="block w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-smit-blue/10 focus:border-smit-blue/30 transition-all text-lg"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-1">
                    <ShieldCheck size={16} /> Confirm Password
                  </label>
                  <div className="relative group">
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      className="block w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-smit-blue/10 focus:border-smit-blue/30 transition-all text-lg"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
                <p className="text-xs text-slate-400 font-bold leading-relaxed">
                  <AlertCircle className="inline w-4 h-4 text-yellow-500 mr-1" />
                  Only students added by Admin via Excel can register. Contact admin if you can't signup.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || authLoading}
                className="w-full flex items-center justify-center gap-4 bg-smit-blue hover:bg-[#003B75] text-white py-5 px-6 rounded-3xl font-extrabold text-xl transition-all shadow-2xl shadow-smit-blue/20 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {(isSubmitting || authLoading) ? "Registering..." : "Create Account"} 
                <UserPlus size={24} />
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-12 flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-24 h-24 bg-green-50 text-smit-green rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-100"
            >
              <CheckCircle2 size={48} />
            </motion.div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Registration Successful!</h2>
            <p className="text-slate-500 font-bold text-lg mb-10 max-w-xs mx-auto leading-relaxed">
              Check your email for verification or login directly. Redirecting...
            </p>
            <Link to="/login" className="bg-smit-blue text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
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

