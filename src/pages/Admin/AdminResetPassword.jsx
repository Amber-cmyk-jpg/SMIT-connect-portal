import { useState } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Lock, CheckCircle2, XCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminResetPassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useSelector(state => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const toggleVisibility = (setter) => setter(state => !state);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update auth password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      
      // Redirect after success
      setTimeout(() => window.location.href = '/admin', 2500);
      
    } catch (err) {
      setError(err.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center border border-green-100"
          >
            <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Password Updated Successfully!</h2>
            <p className="text-slate-600 mb-8">You can now login with your new password.</p>
            <Button className="w-full" onClick={() => window.location.href = '/admin'}>
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="p-8">
          <div className="mb-8">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Lock className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Change Password</h1>
                <p className="text-slate-500">Update your admin account password</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  placeholder="••••••••"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility(setShowCurrent)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showCurrent ? (
                    <EyeOff className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                New Password <span className="text-sm text-slate-500">(8+ chars)</span>
              </label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  placeholder="••••••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility(setShowNew)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showNew ? (
                    <EyeOff className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <Input
              type="password"
              name="confirmNewPassword"
              label="Confirm New Password"
              placeholder="••••••••••••"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
            />

            <Button 
              type="submit" 
              className="w-full h-14 text-lg shadow-lg hover:shadow-purple-500/25" 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminResetPassword;

