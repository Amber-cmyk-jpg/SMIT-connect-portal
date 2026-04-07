import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from './lib/supabaseClient';
import { setAuth, clearAuth } from './store/slices/authSlice';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Leaves from './pages/Leaves';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCourses from './pages/admin/AdminCourses';
import AdminLeaves from './pages/admin/AdminLeaves';
import AdminAddAdmin from './pages/admin/AdminAddAdmin';         // ✅ NEW
import AdminResetPassword from './pages/admin/AdminResetPassword'; // ✅ NEW

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        dispatch(setAuth({ user: session.user, session }));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(setAuth({ user: session.user, session }));
      } else {
        dispatch(clearAuth());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Student protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute role="student">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/leaves" element={
              <ProtectedRoute role="student">
                <Leaves />
              </ProtectedRoute>
            } />

            {/* Admin protected routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/students" element={
              <AdminRoute>
                <AdminStudents />
              </AdminRoute>
            } />
            <Route path="/admin/courses" element={
              <AdminRoute>
                <AdminCourses />
              </AdminRoute>
            } />
            <Route path="/admin/leaves" element={
              <AdminRoute>
                <AdminLeaves />
              </AdminRoute>
            } />
            <Route path="/admin/add-admin" element={
              <AdminRoute>
                <AdminAddAdmin />
              </AdminRoute>
            } />
            <Route path="/admin/reset-password" element={
              <AdminRoute>
                <AdminResetPassword />
              </AdminRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;