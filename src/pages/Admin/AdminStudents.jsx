import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import * as XLSX from 'xlsx'
import { Upload, Users, CheckCircle2, XCircle, FileSpreadsheet, Trash2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null) // { success, failed }
  const [error, setError] = useState('')

  // ── Fetch all students ──────────────────────────────────
  const fetchStudents = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setStudents(data || [])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  // ── Handle Excel Upload ─────────────────────────────────
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setError('')
    setUploadResult(null)
    setUploading(true)

    try {
      const reader = new FileReader()
      reader.onload = async (evt) => {
        const data = new Uint8Array(evt.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet)

        // Expected columns: name, cnic, roll_number
        const toInsert = rows
          .filter((r) => r.cnic && r.roll_number)
          .map((r) => ({
            name: r.name || '',
            cnic: String(r.cnic).trim(),
            roll_number: String(r.roll_number).trim(),
          }))

        if (toInsert.length === 0) {
          setError('No valid rows found. Make sure your Excel has columns: name, cnic, roll_number')
          setUploading(false)
          return
        }

        // Insert with upsert to avoid duplicate errors
        const { data: inserted, error: insertError } = await supabase
          .from('students')
          .upsert(toInsert, { onConflict: 'cnic' })
          .select()

        if (insertError) throw insertError

        setUploadResult({
          success: inserted?.length || toInsert.length,
          failed: toInsert.length - (inserted?.length || toInsert.length),
        })
        fetchStudents()
        setUploading(false)
      }
      reader.readAsArrayBuffer(file)
    } catch (err) {
      setError(err.message)
      setUploading(false)
    }

    // Reset file input
    e.target.value = ''
  }

  // ── Delete a student ────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this student?')) return
    const { error } = await supabase.from('students').delete().eq('id', id)
    if (!error) fetchStudents()
  }

  // ── Download sample Excel template ─────────────────────
  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { name: 'Ali Hassan', cnic: '42101-1234567-1', roll_number: 'SMIT-001' },
      { name: 'Sara Khan',  cnic: '42101-7654321-2', roll_number: 'SMIT-002' },
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Students')
    XLSX.writeFile(wb, 'students_template.xlsx')
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              Student Management
            </h1>
            <p className="text-gray-500 mt-1">Upload students via Excel. Only uploaded students can register.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Download Template */}
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Download Template
            </Button>

            {/* Upload Excel */}
            <label className="cursor-pointer">
              <Button size="sm" as="span" disabled={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Excel'}
              </Button>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {/* Upload result banner */}
        {uploadResult && (
          <div className="mb-6 flex items-center gap-4 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-green-700 font-medium">
              Successfully added <strong>{uploadResult.success}</strong> student(s).
              {uploadResult.failed > 0 && (
                <span className="text-yellow-600 ml-2">
                  {uploadResult.failed} duplicate(s) skipped.
                </span>
              )}
            </p>
            <button onClick={() => setUploadResult(null)} className="ml-auto text-gray-400 hover:text-gray-600">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-4 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-red-700">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-gray-400 hover:text-gray-600">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Excel format hint */}
        <Card className="p-4 mb-6 bg-blue-50 border border-blue-100">
          <p className="text-sm text-blue-700 font-medium mb-1">📋 Excel Format Required</p>
          <p className="text-sm text-blue-600">
            Your Excel file must have these column headers:{' '}
            <code className="bg-blue-100 px-1 rounded">name</code>,{' '}
            <code className="bg-blue-100 px-1 rounded">cnic</code>,{' '}
            <code className="bg-blue-100 px-1 rounded">roll_number</code>
          </p>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-5 text-center">
            <p className="text-3xl font-bold text-blue-600">{students.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Students</p>
          </Card>
          <Card className="p-5 text-center">
            <p className="text-3xl font-bold text-green-600">
              {students.filter((s) => s.registered).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Registered</p>
          </Card>
          <Card className="p-5 text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {students.filter((s) => !s.registered).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Not Yet Signed Up</p>
          </Card>
        </div>

        {/* Students table */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">Loading students...</div>
        ) : students.length === 0 ? (
          <Card className="text-center py-20">
            <FileSpreadsheet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No students added yet</h3>
            <p className="text-gray-400">Upload an Excel file to add students</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">#</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Name</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">CNIC</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Roll Number</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Added On</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {student.name || '—'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-mono">{student.cnic}</td>
                      <td className="px-6 py-4 text-gray-600">{student.roll_number}</td>
                      <td className="px-6 py-4">
                        {student.registered ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3" /> Registered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            <XCircle className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(student.created_at).toLocaleDateString('en-PK', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Remove student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}