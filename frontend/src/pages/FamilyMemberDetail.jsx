import { Link } from 'react-router-dom'
import { Heart, ArrowLeft, Plus, Search, Filter, Eye, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useState, useEffect } from 'react'
import AddReportModal from '../components/AddReportModal'
import ReportDetailModal from '../components/ReportDetailModal'

const FamilyMemberDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [medicalFiles, setMedicalFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sample data for the chart
  const vitalsData = [
    { date: 'Oct 01', systolic: 125, diastolic: 78, sugar: 95 },
    { date: 'Oct 05', systolic: 128, diastolic: 80, sugar: 98 },
    { date: 'Oct 09', systolic: 122, diastolic: 75, sugar: 92 },
    { date: 'Oct 12', systolic: 130, diastolic: 82, sugar: 100 },
    { date: 'Oct 15', systolic: 127, diastolic: 79, sugar: 96 }
  ]

  // Fetch medical files from API
  useEffect(() => {
    const fetchMedicalFiles = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/files', {
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
        // Fallback to sample data if API fails
        setMedicalFiles([
          {
            _id: 1,
            reportType: "CBC Report",
            hospitalName: "Aga Khan",
            doctorName: "Dr. Ahmed",
            reportDate: "2025-10-15",
            notes: "Routine check",
            aiInsight: {
              summary: {
                english: "Hemoglobin slightly low — mild weakness possible. WBC high — suspicion of infection. This is only for understanding, not medical advice.",
                urdu: "Hemoglobin thoda kam hai — mild weakness ho sakti hai. WBC high — infection ka shuba. Yeh sirf understanding ke liye hai, medical advice nahi."
              },
              overallHealthStatus: "fair",
              confidence: 85,
              abnormalValues: [
                {
                  testName: "Hemoglobin",
                  value: "11.2 g/dL",
                  normalRange: "12-16 g/dL",
                  severity: "low",
                  explanation: {
                    english: "Slightly below normal range, may cause mild fatigue",
                    urdu: "Normal range se thoda kam, mild fatigue ho sakti hai"
                  }
                }
              ],
              doctorQuestions: [
                {
                  question: {
                    english: "How far is this value from the normal range?",
                    urdu: "Kya yeh value normal range se kitni dur hai?"
                  }
                },
                {
                  question: {
                    english: "Next steps? Is any repeat test needed?",
                    urdu: "Next steps? Koi repeat test chahiye?"
                  }
                },
                {
                  question: {
                    english: "Should medication be adjusted?",
                    urdu: "Kya medication adjust karni chahiye?"
                  }
                }
              ],
              homeRemedies: [
                {
                  remedy: {
                    english: "Increase hydration; water and broth",
                    urdu: "Hydration barhao; pani aur yakhni"
                  },
                  instructions: {
                    english: "Drink at least 8 glasses of water daily",
                    urdu: "Roz kam se kam 8 glass pani peein"
                  }
                },
                {
                  remedy: {
                    english: "Prioritize rest and sleep",
                    urdu: "Rest aur sleep ko priority dein"
                  },
                  instructions: {
                    english: "Get 7-8 hours of quality sleep",
                    urdu: "7-8 ghante quality sleep lein"
                  }
                }
              ],
              dietaryAdvice: {
                foodsToEat: [
                  {
                    name: {
                      english: "Iron-rich foods (spinach, lentils)",
                      urdu: "Iron-rich foods (palak, lentils)"
                    },
                    reason: {
                      english: "Help increase hemoglobin levels",
                      urdu: "Hemoglobin levels badhane mein madad karte hain"
                    }
                  }
                ],
                foodsToAvoid: [
                  {
                    name: {
                      english: "Excessive sugary drinks",
                      urdu: "Ziada sugary drinks"
                    },
                    reason: {
                      english: "Can affect blood sugar levels",
                      urdu: "Blood sugar levels ko affect kar sakte hain"
                    }
                  }
                ]
              },
              disclaimer: {
                english: "This AI analysis is for educational purposes only. Always consult your doctor before making any medical decisions.",
                urdu: "Yeh AI analysis sirf educational purposes ke liye hai. Koi bhi medical decision lene se pehle apne doctor se zaroor consult karein."
              }
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchMedicalFiles()
  }, [])

  const handleAddReport = (reportData) => {
    // Here you would typically save the report data
    console.log('New report added:', reportData)
    // Refresh the medical files list
    window.location.reload()
  }

  const handleViewReport = (report) => {
    setSelectedReport(report)
    setIsReportModalOpen(true)
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
                <span className="font-medium">← Back</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">You</h1>
                  <p className="text-sm text-white/80">Self</p>
                </div>
              </div>
            </div>

            {/* Add Report Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>+ Add new report</span>
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
                />
              </div>

              {/* Date Filters */}
              <div className="flex space-x-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="w-32 pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 text-white placeholder-white/60 backdrop-blur-sm"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="w-32 pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 text-white placeholder-white/60 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Filter Button */}
              <button className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm">
                <Filter className="w-5 h-5 text-white" />
                <span className="text-white">Filter</span>
              </button>

              {/* Add Report Button */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add new report</span>
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
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500"></div>
                  <span className="ml-3 text-white/80 text-lg">Loading reports...</span>
                </div>
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
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white/80 uppercase tracking-wider">View</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/5 divide-y divide-white/10">
                    {medicalFiles.map((file) => {
                      const flagInfo = getFlagInfo(file.aiInsight)
                      return (
                        <tr key={file._id} className="hover:bg-white/10 transition-all duration-300">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {file.reportType || 'Medical Report'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                            {file.reportType || 'N/A'}
                          </td>
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            {flagInfo.flag && (
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${flagInfo.flagColor}`}>
                                {flagInfo.flag}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => handleViewReport(file)}
                              className="text-pink-300 hover:text-pink-200 flex items-center space-x-2 transition-all duration-300 hover:scale-105"
                            >
                              <Eye className="w-5 h-5" />
                              <span>View</span>
                            </button>
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
    </div>
  </div>
  )
}

export default FamilyMemberDetail
