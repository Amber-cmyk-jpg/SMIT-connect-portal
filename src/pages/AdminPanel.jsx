import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ExcelUploader from '../components/ExcelUploader'
import { Users, BookOpen, FileText, Settings } from 'lucide-react'

const AdminPanel = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('students')

  const tabs = [
    { id: 'students', label: 'Students', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'leaves', label: 'Leave Requests', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'students':
        return (
          <div className="space-y-6">
            <ExcelUploader onSuccess={() => alert('Students uploaded!')} />
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6">Student List</h3>
              <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-500">
                Students uploaded via CSV will appear here
              </div>
            </Card>
          </div>
        )
      case 'courses':
        return (
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Course Management</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Button onClick={() => navigate('/admin/add-course')} className="font-outfit">
                Add New Course
              </Button>
              <Button variant="outline" className="font-outfit">
                Import Courses
              </Button>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
              Courses list & edit forms will appear here
            </div>
          </Card>
        )
      case 'leaves':
        return (
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Pending Leave Requests</h3>
            <div className="grid gap-4">
              {[1,2,3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border">
                  <div>
                    <h4 className="font-semibold">John Doe - Medical Leave</h4>
                    <p className="text-sm text-gray-500">Oct 1-3, 2024</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="green">Approve</Button>
                    <Button size="sm" variant="outline">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )
      case 'settings':
        return (
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6">Admin Settings</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Add New Admin</h4>
                <Button variant="outline" size="sm" className="w-full">Add Admin</Button>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Password Reset</h4>
                <Button variant="outline" size="sm" className="w-full">Reset Password</Button>
              </div>
            </div>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50">
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-outfit font-bold text-smit-dark mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Manage students, courses, and leave requests</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 mb-12">
            {/* Sidebar tabs */}
            <div className="lg:col-span-1 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'primary' : 'outline'}
                    size="lg"
                    className="w-full justify-start font-outfit h-16 p-4"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="w-6 h-6 mr-3 flex-shrink-0" />
                    {tab.label}
                  </Button>
                )
              })}
            </div>

            {/* Content */}
            <div className="lg:col-span-4">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel

