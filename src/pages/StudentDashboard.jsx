import { useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import LeaveForm from '../components/LeaveForm'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Card from '../components/ui/Card'
import { Calendar, FileText, CheckCircle2, Clock } from 'lucide-react'

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [leaves, setLeaves] = useState([
    { id: 1, reason: 'Medical leave', from: '2024-10-01', to: '2024-10-03', status: 'approved' },
    { id: 2, reason: 'Family event', from: '2024-10-10', to: '2024-10-12', status: 'pending' },
  ])

  const handleLeaveSuccess = () => {
    setShowLeaveModal(false)
    // Refetch leaves
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50">
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-outfit font-bold text-smit-dark mb-4">Welcome {user?.email}</h1>
            <p className="text-xl text-gray-600">Manage your leaves and applications</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-10">
              <div className="flex items-center mb-6">
                <Calendar className="w-12 h-12 text-smit-green mr-4" />
                <div>
                  <h3 className="text-2xl font-bold text-smit-dark">Submit Leave Request</h3>
                  <p className="text-gray-600">Request time off with optional attachment</p>
                </div>
              </div>
              <Button onClick={() => setShowLeaveModal(true)} size="lg" className="w-full font-outfit">
                New Leave Request
              </Button>
            </Card>

            <Card className="p-10">
              <div className="flex items-center mb-6">
                <FileText className="w-12 h-12 text-smit-blue mr-4" />
                <div>
                  <h3 className="text-2xl font-bold text-smit-dark">Course Applications</h3>
                  <p className="text-gray-600">View your submitted applications</p>
                </div>
              </div>
              <Button variant="outline" size="lg" className="w-full font-outfit">
                View Applications
              </Button>
            </Card>
          </div>

          {/* Leave History */}
          <Card className="p-8">
            <h3 className="text-2xl font-outfit font-bold text-smit-dark mb-8">Leave History</h3>
            <div className="space-y-4">
              {leaves.map((leave) => (
                <div key={leave.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-smit-dark">{leave.reason}</h4>
                    <p className="text-sm text-gray-500">{leave.from} to {leave.to}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      leave.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {leave.status.toUpperCase()}
                    </span>
                    {leave.status === 'approved' && <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" />}
                    {leave.status === 'pending' && <Clock className="w-5 h-5 text-yellow-500 ml-2" />}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal isOpen={showLeaveModal} onClose={() => setShowLeaveModal(false)} title="New Leave Request">
        <LeaveForm onSuccess={handleLeaveSuccess} onClose={() => setShowLeaveModal(false)} />
      </Modal>
    </div>
  )
}

export default StudentDashboard

