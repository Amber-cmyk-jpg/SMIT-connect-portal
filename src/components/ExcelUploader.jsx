import { useState } from 'react'
import Button from './ui/Button'
import { Upload, AlertCircle } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { uploadStudentsExcel } from '../features/students/studentsSlice'

const ExcelUploader = ({ onSuccess }) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.name.endsWith('.csv')) { // Simplified CSV support
      setFile(selectedFile)
      setError('')
    } else {
      setError('Please upload a CSV file with columns: cnic,roll_no,name,email')
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      await dispatch(uploadStudentsExcel(file)).unwrap()
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-smit-blue transition-colors">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="excel-upload"
        />
        <label htmlFor="excel-upload" className="cursor-pointer">
          <Button variant="outline" size="lg" className="font-outfit">
            Choose CSV File
          </Button>
        </label>
        {file && (
          <p className="text-sm text-gray-600 mt-2 truncate">{file.name}</p>
        )}
      </div>
      
      {error && (
        <div className="flex items-center text-red-500 bg-red-50 border border-red-100 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <Button 
        onClick={handleUpload} 
        disabled={!file || loading} 
        size="lg" 
        className="w-full font-outfit"
      >
        {loading ? 'Uploading...' : 'Upload Students'}
      </Button>
    </div>
  )
}

export default ExcelUploader

