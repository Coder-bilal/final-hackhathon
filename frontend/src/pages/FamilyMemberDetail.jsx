import { Link, useParams } from 'react-router-dom'
import { Heart, ArrowLeft, Plus, Search, Filter, Eye, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'
import AddReportModal from '../components/AddReportModal'
import ReportDetailModal from '../components/ReportDetailModal'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import EditReportModal from '../components/EditReportModal'
import PremiumLoader from '../components/PremiumLoader'

const FamilyMemberDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [medicalFiles, setMedicalFiles] = useState([])
  const [reportLoading, setReportLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [memberDetail, setMemberDetail] = useState(null)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);

  useEffect(() => { setFilteredFiles(medicalFiles); }, [medicalFiles]);

  const handleSearch = () => {
    let filtered = medicalFiles;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(file => {
        const values = [file.title, file.testName, file.reportType, file.hospitalName, file.doctorName];
        return values.some(val => val && val.toLowerCase().includes(term));
      });
    }
    if (searchDate.trim()) {
      filtered = filtered.filter(file => {
        if (!file.reportDate) return false;
        const fileDate = new Date(file.reportDate);
        const fileDateStr = fileDate.toISOString().slice(0, 10); // yyyy-mm-dd
        return fileDateStr === searchDate;
      });
    }
    setFilteredFiles(filtered);
  };

  const params = useParams()
  // familyMemberId will be params.id if present, otherwise 'self'
  const memberId = params?.id || 'self'
  const isSelf = memberId === 'self'

  // Build live chart data from database medicalFiles
  const vitalsData = medicalFiles.filter(f =>
    typeof f.bpSystolic === 'number' && typeof f.bpDiastolic === 'number' && typeof f.sugar === 'number'
  ).map(f => ({
    date: f.reportDate ? new Date(f.reportDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : '',
    systolic: f.bpSystolic,
    diastolic: f.bpDiastolic,
    sugar: f.sugar
  }))

  // Fetch medical files from API
  useEffect(() => {
    const fetchMedicalFiles = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const API_BASE = (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) || ''
        const response = await fetch(`${API_BASE}/api/files?memberId=${memberId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch medical files')
        }
        const data = await response.json()
        setMedicalFiles(data.files || [])
      } catch (err) {
        console.error('Error fetching medical files:', err)
        setError(err.message)
        setMedicalFiles([])
      } finally {
        setLoading(false)
      }
    }
    fetchMedicalFiles()
    // refetch whenever memberId changes
  }, [memberId])

  // Fetch member info for header
  useEffect(() => {
    const getMemberName = async () => {
      if (memberId === 'self') {
        setMemberDetail({ name: 'You', relation: 'Self' })
        return
      }
      try {
        const token = localStorage.getItem('token')
        const API_BASE = (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) || ''
        const res = await fetch(`${API_BASE}/api/family/${memberId}`, { headers: { 'Authorization': `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.member) setMemberDetail({ name: data.member.name, relation: data.member.relation, color: data.member.color })
          else setMemberDetail({ name: 'Family Member', relation: '' })
        } else {
          setMemberDetail({ name: 'Family Member', relation: '' })
        }
      } catch {
        setMemberDetail({ name: 'Family Member', relation: '' })
      }
    }
    getMemberName()
  }, [memberId])

  const handleAddReport = async (reportData) => {
    setReportLoading(true)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()

      // Add text fields
      formData.append('reportType', reportData.testName)
      if (reportData.title) formData.append('title', reportData.title)
      if (reportData.testName) formData.append('testName', reportData.testName)
      formData.append('hospitalName', reportData.hospital)
      formData.append('doctorName', reportData.doctor)
      formData.append('reportDate', reportData.date)
      if (reportData.price) formData.append('price', String(reportData.price))
      formData.append('notes', reportData.notes || '')
      // Vitals
      if (reportData.bpSystolic) formData.append('bpSystolic', reportData.bpSystolic)
      if (reportData.bpDiastolic) formData.append('bpDiastolic', reportData.bpDiastolic)
      if (reportData.fastingSugar) formData.append('sugar', reportData.fastingSugar)

      // Add files if any
      if (reportData.files && reportData.files.length > 0) {
        for (let i = 0; i < reportData.files.length; i++) {
          formData.append('files', reportData.files[i])
        }
      }

      // Associate correct family member (or self) on upload
      formData.append('familyMemberId', memberId !== 'self' ? memberId : '')

      const API_BASE = (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) || ''
      const response = await fetch(`${API_BASE}/api/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        // Refresh the medical files list
        const fetchMembers = async () => {
          try {
            const token = localStorage.getItem('token')
            const API_BASE = (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) || ''
            const res = await fetch(`${API_BASE}/api/files?memberId=${memberId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
            const data = await res.json()
            if (data.success) {
              setMedicalFiles(data.files || [])
            }
          } catch (err) {
            console.error('Error fetching medical files:', err)
          }
        }
        await fetchMembers()
      } else {
        alert('Failed to add report: ' + (data.message || 'Unknown error') + (data.error ? ('\nDetails: ' + data.error) : ''))
      }
    } catch (error) {
      console.error('Error adding report:', error)
    } finally {
      setReportLoading(false)
    }
  }

  const handleViewReport = async (report) => {
    try {
      const token = localStorage.getItem('token')
      const API_BASE = (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) || ''
      const res = await fetch(`${API_BASE}/api/files/${report._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setSelectedReport({ ...data.file, aiInsight: data.aiInsight || null })
      } else {
        setSelectedReport(report)
      }
    } catch (e) {
      console.error('Failed to load report details', e)
      setSelectedReport(report)
    } finally {
      setIsReportModalOpen(true)
    }
  }

  const requestDelete = (report) => { setSelectedReport(report); setIsDeleteOpen(true) }
  const confirmDelete = async () => {
    if (!selectedReport) return
    try {
      const token = localStorage.getItem('token')
      const API_BASE = (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) || ''
      const res = await fetch(`${API_BASE}/api/files/${selectedReport._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setMedicalFiles(medicalFiles.filter(f => f._id !== selectedReport._id))
      }
    } catch (e) { console.error(e) }
    setIsDeleteOpen(false)
    setSelectedReport(null)
  }

  const requestEdit = (report) => { setSelectedReport(report); setIsEditOpen(true) }
  const saveEdit = async (changes) => {
    if (!selectedReport) return
    try {
      const token = localStorage.getItem('token')
      const API_BASE = (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) || ''
      const res = await fetch(`${API_BASE}/api/files/${selectedReport._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType: changes.reportType,
          hospitalName: changes.hospitalName,
          doctorName: changes.doctorName,
          reportDate: changes.reportDate,
          price: changes.price,
          notes: changes.notes,
          title: changes.title,
          testName: changes.reportType
        })
      })
      const data = await res.json()
      if (data.success) {
        setMedicalFiles(medicalFiles.map(f => f._id === selectedReport._id ? data.file : f))
      } else {
        console.error('Failed to update report: ', data.message)
      }
    } catch (e) { console.error(e) }
    setIsEditOpen(false)
    setSelectedReport(null)
  }

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false)
    setSelectedReport(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getFlagInfo = (aiInsight) => {
    if (!aiInsight) return { flag: '', flagColor: '' }

    const status = aiInsight.overallHealthStatus
    switch (status) {
      case 'excellent':
      case 'good':
        return { flag: 'Normal', flagColor: 'bg-green-100 text-green-800' }
      case 'fair':
        return { flag: 'Fair', flagColor: 'bg-yellow-100 text-yellow-800' }
      case 'poor':
        return { flag: 'Poor', flagColor: 'bg-orange-100 text-orange-800' }
      case 'critical':
        return { flag: 'Critical', flagColor: 'bg-red-100 text-red-800' }
      default:
        return { flag: '', flagColor: '' }
    }
  }

  if (reportLoading) return <PremiumLoader label="Saving report..." />
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Orbs */}
          <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-3000"></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Back Button and Member Info */}
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 text-white hover:text-pink-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{memberDetail?.name || (isSelf ? 'You' : 'Family Member')}</h1>
                  <p className="text-sm text-white/80">{memberDetail?.relation || (isSelf ? 'Self' : 'Family Member')}</p>
                </div>
              </div>
            </div>

            {/* Add Report Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add new report</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Vitals Trend Chart */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Vitals trend</h2>
                  <p className="text-sm text-white/80">Systolic / Diastolic BP and Fasting Sugar</p>
                </div>
                <Link
                  to="#recent-entries"
                  className="text-pink-300 hover:text-pink-200 text-sm font-medium transition-colors"
                >
                  Recent entries
                </Link>
              </div>

              {/* Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vitalsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#6B7280' }}
                    />
                    <YAxis
                      domain={[70, 140]}
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#6B7280' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                      name="Systolic"
                    />
                    <Line
                      type="monotone"
                      dataKey="sugar"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      name="Sugar"
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                      name="Diastolic"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, test, lab..."
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 text-white placeholder-white/60 backdrop-blur-sm"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="date"
                    className="w-32 pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 text-white placeholder-white/60 backdrop-blur-sm"
                    value={searchDate}
                    onChange={e => setSearchDate(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
                  />
                </div>
                <button
                  className="px-4 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={handleSearch}
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Recent Entries Table */}
            <div id="recent-entries" className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/20">
                <h3 className="text-xl font-semibold text-white">Recent entries</h3>
              </div>

              <div className="overflow-x-auto">
                {loading ? (
                  <PremiumLoader label="Loading reports..." />
                ) : error ? (
                  <div className="text-center py-12">
                    <p className="text-red-300 mb-2 text-lg">Error loading reports: {error}</p>
                    <p className="text-white/60">Showing sample data</p>
                  </div>
                ) : medicalFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/80 text-lg">No reports found. Add your first report!</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Test</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Lab/Hospital</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Doctor</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">File</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/5 divide-y divide-white/10">
                      {filteredFiles.map((file) => {
                        const priceDisplay = typeof file.price === 'number' ? `Rs ${file.price.toLocaleString()}` : '—'
                        const humanize = (s) => String(s || '').replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
                        const displayTest =
                          file.testName && file.testName.toLowerCase() !== 'other'
                            ? file.testName
                            : (file.reportType && file.reportType.toLowerCase() !== 'other'
                              ? humanize(file.reportType)
                              : ''
                            );
                        const displayTitle = file.title || displayTest
                        return (
                          <tr key={file._id} className="hover:bg-white/10 transition-all duration-300">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{displayTitle || 'Medical Report'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{file.testName || (file.reportType && file.reportType.toLowerCase() !== 'other' ? humanize(file.reportType) : 'N/A')}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                              {file.hospitalName || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                              {file.doctorName || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                              {formatDate(file.reportDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                              {file.originalName || 'Report.pdf'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{priceDisplay}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleViewReport(file)}
                                  className="text-pink-300 hover:text-pink-200 flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                                >
                                  <Eye className="w-5 h-5" />
                                  <span>View</span>
                                </button>
                                <button
                                  onClick={() => requestEdit(file)}
                                  className="text-blue-300 hover:text-blue-200 transition-all duration-300 hover:scale-105"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => requestDelete(file)}
                                  className="text-red-300 hover:text-red-200 transition-all duration-300 hover:scale-105"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Add Report Modal */}
        <AddReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddReport}
        />

        {/* Report Detail Modal */}
        <ReportDetailModal
          isOpen={isReportModalOpen}
          onClose={handleCloseReportModal}
          reportData={selectedReport}
          aiInsight={selectedReport?.aiInsight}
        />

        <ConfirmDeleteModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={confirmDelete}
        />

        <EditReportModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSave={saveEdit}
          initial={selectedReport}
        />
      </div>
    </div>
  )
}

export default FamilyMemberDetail
