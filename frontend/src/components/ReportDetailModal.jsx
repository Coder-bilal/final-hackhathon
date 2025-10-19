import { useState, useEffect } from 'react'
import { X, FileText, Calendar, MapPin, User, AlertCircle, Heart, Brain, Utensils, Home, MessageCircle } from 'lucide-react'

const ReportDetailModal = ({ isOpen, onClose, reportData, aiInsight }) => {
  if (!isOpen || !reportData) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return 'bg-green-100 text-green-800'
      case 'fair':
        return 'bg-yellow-100 text-yellow-800'
      case 'poor':
        return 'bg-orange-100 text-orange-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800'
      case 'normal':
        return 'bg-green-100 text-green-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="sticky top-0 bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{reportData.reportType || 'Medical Report'}</h2>
              <p className="text-sm text-white/80">Detailed Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Report Details */}
            <div className="space-y-6">
              {/* Report Information */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-pink-400" />
                  Report Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-white/60" />
                    <span className="text-sm text-white/80">Date:</span>
                    <span className="text-sm font-medium text-white">
                      {formatDate(reportData.reportDate)}
                    </span>
                  </div>
                  {reportData.hospitalName && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-white/60" />
                      <span className="text-sm text-white/80">Lab/Hospital:</span>
                      <span className="text-sm font-medium text-white">
                        {reportData.hospitalName}
                      </span>
                    </div>
                  )}
                  {reportData.doctorName && (
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-white/60" />
                      <span className="text-sm text-white/80">Doctor:</span>
                      <span className="text-sm font-medium text-white">
                        {reportData.doctorName}
                      </span>
                    </div>
                  )}
                  {reportData.notes && (
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="w-5 h-5 text-white/60 mt-1" />
                      <div>
                        <span className="text-sm text-white/80">Notes:</span>
                        <p className="text-sm font-medium text-white mt-1">
                          {reportData.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Summary */}
              {aiInsight && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-blue-500" />
                    AI Summary (Simple Words)
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>English:</strong> {aiInsight.summary?.english || 'Analysis not available'}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Urdu:</strong> {aiInsight.summary?.urdu || 'Analysis available nahi hai'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Overall Status:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(aiInsight.overallHealthStatus)}`}>
                        {aiInsight.overallHealthStatus || 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-600">
                        ({aiInsight.confidence || 0}% confidence)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Abnormal Values */}
              {aiInsight?.abnormalValues && aiInsight.abnormalValues.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                    Abnormal Values
                  </h3>
                  <div className="space-y-3">
                    {aiInsight.abnormalValues.map((value, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{value.testName}</span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(value.severity)}`}>
                            {value.severity}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Value:</span> {value.value} | 
                          <span className="font-medium ml-1">Normal Range:</span> {value.normalRange}
                        </div>
                        <div className="text-sm text-gray-700">
                          <p><strong>English:</strong> {value.explanation?.english}</p>
                          <p><strong>Urdu:</strong> {value.explanation?.urdu}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Recommendations */}
            <div className="space-y-6">
              {/* Home Remedies */}
              {aiInsight?.homeRemedies && aiInsight.homeRemedies.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Home className="w-5 h-5 mr-2 text-green-500" />
                    Home Remedies
                  </h3>
                  <div className="space-y-3">
                    {aiInsight.homeRemedies.map((remedy, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-sm text-gray-700 mb-1">
                          <strong>English:</strong> {remedy.remedy?.english}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Urdu:</strong> {remedy.remedy?.urdu}
                        </p>
                        <p className="text-xs text-gray-600">
                          <strong>Instructions:</strong> {remedy.instructions?.english}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions for Doctor */}
              {aiInsight?.doctorQuestions && aiInsight.doctorQuestions.length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-purple-500" />
                    Questions for Your Doctor
                  </h3>
                  <div className="space-y-3">
                    {aiInsight.doctorQuestions.map((question, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border border-purple-200">
                        <p className="text-sm text-gray-700 mb-1">
                          <strong>English:</strong> {question.question?.english}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Urdu:</strong> {question.question?.urdu}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietary Advice */}
              {aiInsight?.dietaryAdvice && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Utensils className="w-5 h-5 mr-2 text-yellow-500" />
                    Diet Tips
                  </h3>
                  
                  {/* Foods to Eat */}
                  {aiInsight.dietaryAdvice.foodsToEat && aiInsight.dietaryAdvice.foodsToEat.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-green-700 mb-2">Foods to Eat:</h4>
                      <div className="space-y-2">
                        {aiInsight.dietaryAdvice.foodsToEat.map((food, index) => (
                          <div key={index} className="bg-white rounded-lg p-2 border border-green-200">
                            <p className="text-sm text-gray-700">
                              <strong>{food.name?.english}</strong> ({food.name?.urdu})
                            </p>
                            <p className="text-xs text-gray-600">{food.reason?.english}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Foods to Avoid */}
                  {aiInsight.dietaryAdvice.foodsToAvoid && aiInsight.dietaryAdvice.foodsToAvoid.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-red-700 mb-2">Foods to Avoid:</h4>
                      <div className="space-y-2">
                        {aiInsight.dietaryAdvice.foodsToAvoid.map((food, index) => (
                          <div key={index} className="bg-white rounded-lg p-2 border border-red-200">
                            <p className="text-sm text-gray-700">
                              <strong>{food.name?.english}</strong> ({food.name?.urdu})
                            </p>
                            <p className="text-xs text-gray-600">{food.reason?.english}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Disclaimer */}
              {aiInsight?.disclaimer && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800 mb-1">Important Disclaimer</h4>
                      <p className="text-xs text-red-700 mb-1">
                        <strong>English:</strong> {aiInsight.disclaimer.english}
                      </p>
                      <p className="text-xs text-red-700">
                        <strong>Urdu:</strong> {aiInsight.disclaimer.urdu}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportDetailModal
