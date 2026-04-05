import { useState } from 'react'
import Input from './ui/Input'
import Button from './ui/Button'
import { Calendar, Image, Send } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { submitLeave } from '../features/leaves/leavesSlice'

const LeaveForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    reason: '',
    fromDate: '',
    toDate: '',
    image: null,
  })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await dispatch(submitLeave(formData)).unwrap()
      onSuccess()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Reason"
        value={formData.reason}
        onChange={(e) => setFormData({...formData, reason: e.target.value})}
        required
        placeholder="Enter leave reason..."
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="From Date"
          type="date"
          value={formData.fromDate}
          onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
          required
        />
        <Input
          label="To Date"
          type="date"
          value={formData.toDate}
          onChange={(e) => setFormData({...formData, toDate: e.target.value})}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachment <Image className="inline w-4 h-4 ml-1" />
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-smit-blue"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Submitting...' : 'Submit Leave'}
        </Button>
      </div>
    </form>
  )
}

export default LeaveForm

