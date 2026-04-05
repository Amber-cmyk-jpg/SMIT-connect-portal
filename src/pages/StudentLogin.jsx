import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logIn, clearError } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    try {
      await dispatch(logIn(formData)).unwrap()
      navigate('/dashboard')
    } catch (err) {
      // Error handled by slice
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50">
      <Header />
      
      <div className="pt-32 pb-12 px-4 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-outfit font-bold text-smit-dark mb-4">Welcome Back</h1>
            <p className="text-gray-600 font-outfit">Sign in to your student account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              placeholder="student@smit.edu.pk"
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Don't have an account? <Link to="/signup" className="text-smit-blue hover:underline font-medium">Sign up</Link>
            </p>
            <Link to="/admin" className="text-sm text-gray-500 hover:text-smit-blue">Admin Login →</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default StudentLogin

