import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logIn, clearError } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { Shield } from 'lucide-react'

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)

useEffect(() => {
  return () => {
    dispatch({ type: 'auth/clearError' })
  }
}, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await dispatch(logIn(formData)).unwrap()
      if (result.role === 'admin') {
        navigate('/admin')
      } else {
        alert('Admin access only')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="pt-32 pb-12 px-4 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full p-10 shadow-2xl">
          <div className="text-center mb-10">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Admin Panel</h1>
            <p className="text-slate-600">Secure admin login</p>
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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="admin@smit.edu.pk"
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
            />

            <Button type="submit" size="lg" className="w-full text-lg py-4" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Admin Login'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <a href="/admin/reset-password" className="text-sm text-slate-500 hover:text-blue-600 font-medium">
              Forgot Password?
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AdminLogin

