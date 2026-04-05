import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { logOut } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { User, LogOut, Menu } from 'lucide-react'
import Button from './ui/Button'

const Header = () => {
  const { user, role } = useAuth()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logOut())
  }

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/src/assets/saylani-logo.png" className="h-10 w-auto" alt="SMIT Logo" />
            <span className="text-2xl font-outfit font-bold bg-gradient-to-r from-smit-blue to-smit-dark bg-clip-text text-transparent">
              SMIT Connect
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="font-outfit text-lg hover:text-smit-blue transition-colors">Home</Link>
            <Link to="/courses" className="font-outfit text-lg hover:text-smit-blue transition-colors">Courses</Link>
            
            {user ? (
              <>
                {role === 'admin' && (
                  <Link to="/admin" className="font-outfit text-lg hover:text-smit-blue transition-colors">Admin</Link>
                )}
                <Link to="/dashboard" className="font-outfit text-lg hover:text-smit-blue transition-colors">Dashboard</Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>

          <div className="md:hidden">
            <Menu className="w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

