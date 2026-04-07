import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Users, Mail, Lock, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAddAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create auth user first
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: `${formData.username}@smitadmin.local`,
        password: formData.password,
        email_confirm: true
      });

      if (authError) throw authError;

      // Insert profile row
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          name: formData.name,
          username: formData.username,
          role: 'admin',
          email: `${formData.username}@smitadmin.local`
        });

      if (profileError) throw profileError;

      setSuccess(true);
      setFormData({ name: '', username: '', password: '', confirmPassword: '' });
      
      // Auto redirect after 3s
      setTimeout(() => window.location.reload(), 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to create admin');
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
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Admin Created Successfully!</h2>
            <p className="text-slate-600 mb-8">New admin can now login with username/password provided.</p>
            <Button className="w-full" onClick={() => window.location.reload()}>
              Add Another Admin
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
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Add New Admin</h1>
              <p className="text-slate-500">Create admin accounts for portal management</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Username"
              name="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              label="Password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button 
              type="submit" 
              className="w-full h-14 text-lg" 
              disabled={loading}
              loading={loading}
            >
              {loading ? 'Creating...' : 'Create Admin'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAddAdmin;

