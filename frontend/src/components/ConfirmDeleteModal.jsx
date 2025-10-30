import { X, Trash2 } from 'lucide-react'

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title = 'Delete report' , subtitle = 'This action cannot be undone.'}) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white w-full max-w-md rounded-2xl border border-white/15 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-300" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-2">
          <p className="text-white/80">Are you sure you want to delete this report?</p>
          <p className="text-xs text-white/60">{subtitle}</p>
        </div>
        <div className="px-6 py-4 flex items-center gap-3 border-t border-white/10">
          <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 transition">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal


