import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Calendar, CheckCircle2, XCircle, Clock, Eye, X, Upload } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

const STATUS_STYLES = {
  pending:  { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock className="w-4 h-4" /> },
  approved: { bg: 'bg-green-100',  text: 'text-green-700',  icon: <CheckCircle2 className="w-4 h-4" /> },
  rejected: { bg: 'bg-red-100',    text: 'text-red-700',    icon: <XCircle className="w-4 h-4" /> },
}

export default function AdminLeaves() {
  const [leaves, setLeaves]               = useState([])
  const [isLoading, setIsLoading]         = useState(true)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [updating, setUpdating]           = useState(false)
  const [filter, setFilter]               = useState('all')

  const fetchLeaves = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('leaves')
      .select(`*, students ( name, cnic, roll_number )`)
      .order('created_at', { ascending: false })
    if (!error) setLeaves(data || [])
    setIsLoading(false)
  }

  useEffect(() => { fetchLeaves() }, [])

  const handleStatus = async (id, status) => {
    setUpdating(true)
    const { error } = await supabase.from('leaves').update({ status }).eq('id', id)
    if (!error) {
      setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
      if (selectedLeave?.id === id) setSelectedLeave((prev) => ({ ...prev, status }))
    }
    setUpdating(false)
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })

  const dayCount = (start, end) =>
    Math.max(1, Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1)

  const filtered = filter === 'all' ? leaves : leaves.filter((l) => l.status === filter)
  const counts = {
    all:      leaves.length,
    pending:  leaves.filter((l) => l.status === 'pending').length,
    approved: leaves.filter((l) => l.status === 'approved').length,
    rejected: leaves.filter((l) => l.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            Leave Management
          </h1>
          <p className="text-gray-500 mt-1">Review and manage student leave requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { key: 'all',      label: 'Total',    color: 'text-blue-600',   bg: 'bg-blue-50'   },
            { key: 'pending',  label: 'Pending',  color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { key: 'approved', label: 'Approved', color: 'text-green-600',  bg: 'bg-green-50'  },
            { key: 'rejected', label: 'Rejected', color: 'text-red-600',    bg: 'bg-red-50'    },
          ].map((s) => (
            <button key={s.key} onClick={() => setFilter(s.key)}
              className={`rounded-2xl p-5 text-center transition-all border-2 ${filter === s.key ? 'border-blue-400 shadow-md' : 'border-transparent'} ${s.bg}`}>
              <p className={`text-3xl font-bold ${s.color}`}>{counts[s.key]}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
              }`}>
              {f} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Loading leave requests...</div>
        ) : filtered.length === 0 ? (
          <Card className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No requests found</h3>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Student</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Reason</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Date Range</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Days</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Submitted</th>
                    <th className="px-6 py-4 font-semibold text-gray-600 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((leave) => {
                    const style = STATUS_STYLES[leave.status] || STATUS_STYLES.pending
                    return (
                      <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">{leave.students?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400">{leave.students?.roll_number}</p>
                        </td>
                        <td className="px-6 py-4 max-w-[200px]">
                          <p className="text-gray-700 truncate">{leave.reason}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                          {formatDate(leave.start_date)} → {formatDate(leave.end_date)}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-gray-700">
                          {dayCount(leave.start_date, leave.end_date)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                            {style.icon}
                            <span className="capitalize">{leave.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                          {formatDate(leave.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-center">
                            <button onClick={() => setSelectedLeave(leave)} className="text-blue-500 hover:text-blue-700" title="View details">
                              <Eye className="w-4 h-4" />
                            </button>
                            {leave.status !== 'approved' && (
                              <button onClick={() => handleStatus(leave.id, 'approved')} disabled={updating} className="text-green-500 hover:text-green-700" title="Approve">
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {leave.status !== 'rejected' && (
                              <button onClick={() => handleStatus(leave.id, 'rejected')} disabled={updating} className="text-red-400 hover:text-red-600" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Detail Popup */}
      {selectedLeave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
            <button onClick={() => setSelectedLeave(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-5">Leave Request Details</h2>

            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="font-semibold text-gray-800 text-lg">{selectedLeave.students?.name || 'Unknown Student'}</p>
              <p className="text-sm text-gray-500">CNIC: {selectedLeave.students?.cnic} | Roll No: {selectedLeave.students?.roll_number}</p>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Reason</p>
                <p className="text-gray-700">{selectedLeave.reason}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Start Date</p>
                  <p className="text-gray-700 font-medium">{formatDate(selectedLeave.start_date)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">End Date</p>
                  <p className="text-gray-700 font-medium">{formatDate(selectedLeave.end_date)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Duration</p>
                <p className="text-gray-700 font-medium">{dayCount(selectedLeave.start_date, selectedLeave.end_date)} day(s)</p>
              </div>
              {selectedLeave.image_url && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Attachment</p>
                  <a href={selectedLeave.image_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm">
                    <Upload className="w-4 h-4" /> View Attached File
                  </a>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Status</p>
                {(() => {
                  const style = STATUS_STYLES[selectedLeave.status] || STATUS_STYLES.pending
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
                      {style.icon} <span className="capitalize">{selectedLeave.status}</span>
                    </span>
                  )
                })()}
              </div>
            </div>

            {selectedLeave.status === 'pending' ? (
              <div className="flex gap-3 pt-2 border-t border-gray-100">
                <Button variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  disabled={updating} onClick={() => handleStatus(selectedLeave.id, 'rejected')}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button variant="green" className="flex-1" disabled={updating}
                  onClick={() => handleStatus(selectedLeave.id, 'approved')}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                </Button>
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-100">
                <Button variant="secondary" className="w-full" disabled={updating}
                  onClick={() => handleStatus(selectedLeave.id, selectedLeave.status === 'approved' ? 'rejected' : 'approved')}>
                  Switch to {selectedLeave.status === 'approved' ? 'Rejected' : 'Approved'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}