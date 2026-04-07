import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '../lib/supabaseClient'
import { Plus, X, Calendar, Clock, CheckCircle2, XCircle, Upload } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const STATUS_STYLES = {
  pending:  { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock    className="w-4 h-4" /> },
  approved: { bg: 'bg-green-100',  text: 'text-green-700',  icon: <CheckCircle2 className="w-4 h-4" /> },
  rejected: { bg: 'bg-red-100',    text: 'text-red-700',    icon: <XCircle  className="w-4 h-4" /> },
}

export default function Leaves() {
  const { user } = useSelector((state) => state.auth)

  const [leaves, setLeaves]       = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')

  const [form, setForm] = useState({
    reason:     '',
    start_date: '',
    end_date:   '',
    image:      null,
  })

  // ── Fetch this student's leaves ──────────────────────────
  const fetchLeaves = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('leaves')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setLeaves(data)
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) fetchLeaves()
  }, [user])

  // ── Handle form field changes ────────────────────────────
  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
      setForm((f) => ({ ...f, image: files[0] }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }

  // ── Submit leave request ─────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.end_date < form.start_date) {
      setError('End date cannot be before start date.')
      return
    }

    setSubmitting(true)
    try {
      let image_url = null

      // Upload image if provided
      if (form.image) {
        const ext      = form.image.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('leave-attachments')
          .upload(fileName, form.image)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('leave-attachments')
          .getPublicUrl(fileName)

        image_url = urlData.publicUrl
      }

      // Insert leave record
      const { error: insertError } = await supabase.from('leaves').insert({
        user_id:    user.id,
        reason:     form.reason,
        start_date: form.start_date,
        end_date:   form.end_date,
        image_url,
        status:     'pending',
      })

      if (insertError) throw insertError

      // Reset and refresh
      setForm({ reason: '', start_date: '', end_date: '', image: null })
      setShowForm(false)
      fetchLeaves()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Helpers ──────────────────────────────────────────────
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })

  const dayCount = (start, end) => {
    const diff = new Date(end) - new Date(start)
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1)
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Leave Requests</h1>
            <p className="text-gray-500 mt-1">Submit and track your leave applications</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>

        {/* ── Submit Form Modal ── */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-6">Submit Leave Request</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Leave
                  </label>
                  <textarea
                    name="reason"
                    required
                    rows={3}
                    value={form.reason}
                    onChange={handleChange}
                    placeholder="Explain the reason for your leave..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Date range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      required
                      value={form.start_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      required
                      value={form.end_date}
                      onChange={handleChange}
                      min={form.start_date || new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Image upload (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attachment <span className="text-gray-400">(optional)</span>
                  </label>
                  <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:border-blue-400 transition-colors">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {form.image ? form.image.name : 'Click to upload image'}
                    </span>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Leave list ── */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Loading your requests...</div>
        ) : leaves.length === 0 ? (
          <Card className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No leave requests yet</h3>
            <p className="text-gray-400 mb-6">Click "New Request" to submit your first leave</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {leaves.map((leave) => {
              const style = STATUS_STYLES[leave.status] || STATUS_STYLES.pending
              return (
                <Card key={leave.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: reason + dates */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 mb-1 truncate">{leave.reason}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(leave.start_date)} → {formatDate(leave.end_date)}
                        </span>
                        <span className="text-gray-400">
                          ({dayCount(leave.start_date, leave.end_date)} day
                          {dayCount(leave.start_date, leave.end_date) > 1 ? 's' : ''})
                        </span>
                      </div>

                      {/* Attachment link */}
                      {leave.image_url && (
  <a                         // ✅ add <a here
    href={leave.image_url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2"
  >
    <Upload className="w-3 h-3" />
    View attachment
  </a>
)}
                    </div>

                    {/* Right: status badge */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${style.bg} ${style.text} shrink-0`}>
                      {style.icon}
                      <span className="capitalize">{leave.status}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    Submitted on {formatDate(leave.created_at)}
                  </p>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}