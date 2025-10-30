import { useState, useEffect } from 'react'
import { X, FileText, Building, User, Calendar, DollarSign, MessageSquare } from 'lucide-react'

const EditReportModal = ({ isOpen, onClose, onSave, initial }) => {
  const [form, setForm] = useState({
    testName: '',
    hospitalName: '',
    doctorName: '',
    reportDate: '',
    price: '',
    notes: '',
    title: '',
  })

  useEffect(() => {
    if (initial) {
      setForm({
        testName: initial.testName || initial.reportType || '',
        hospitalName: initial.hospitalName || '',
        doctorName: initial.doctorName || '',
        reportDate: initial.reportDate ? String(initial.reportDate).slice(0,10) : '',
        price: initial.price ?? '',
        notes: initial.notes || '',
        title: initial.title || '',
      })
    }
  }, [initial])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const submit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white w-full max-w-lg rounded-2xl border border-white/15 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-pink-300" />
           </div>
            <h3 className="text-lg font-semibold">Edit report</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
      <form onSubmit={submit} className="px-6 py-5 space-y-4">
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input name="testName" value={form.testName} onChange={handleChange} placeholder="Test name" className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input name="hospitalName" value={form.hospitalName} onChange={handleChange} placeholder="Hospital / Lab" className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input name="doctorName" value={form.doctorName} onChange={handleChange} placeholder="Doctor" className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input type="date" name="reportDate" value={form.reportDate} onChange={handleChange} className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price (Rs)" className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-white/50" />
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Notes" className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/10 border border-white/15 focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition">Cancel</button>
          <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 transition">Save</button>
        </div>
      </form>
      </div>
    </div>
  )
}

export default EditReportModal


