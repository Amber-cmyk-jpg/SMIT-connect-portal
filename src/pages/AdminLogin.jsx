import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logIn, clearError } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { Shield } from 'lucide-react'

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    try {
      const result = await dispatch(logIn(formData)).unwrap()
      if (result.role === 'admin') {
        navigate('/admin')
      } else {
        // Not admin
        alert('Admin access only')
      }
    } catch (err) {
      // Error shown
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <Header />
      
      <div className="pt-32 pb-12 px-4 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full p-10 shadow-2xl">
          <div className="text-center mb-10">
            <Shield className="w-16 h-16 text-smit-blue mx-auto mb-6" />
            <h1 className="text-4xl font-outfit font-bold text-smit-dark mb-4">Admin Panel</h1>
            <p className="text-gray-600 font-outfit">Secure admin login</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Admin Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              placeholder="admin@smit.edu.pk"
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              placeholder="••••••••"
            />

            <Button type="submit" size="lg" className="w-full font-outfit text-lg py-4" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Admin Login'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <a href="#" className="text-sm text-gray-500 hover:text-smit-blue">Forgot Password?</a>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminLogin

