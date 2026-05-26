'use client'

import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useDashboard } from './dashboard-context'

export function ToastContainer() {
  const { toasts, removeToast } = useDashboard()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border bg-[#0b1510] shadow-2xl min-w-[280px] max-w-[360px] animate-in slide-in-from-right-4 fade-in duration-200"
          style={{
            borderColor: toast.type === 'success' ? 'rgba(0,240,128,0.3)' : toast.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(56,189,248,0.3)',
          }}
        >
          {toast.type === 'success' && <CheckCircle size={14} className="text-[#00f080] flex-shrink-0 mt-0.5" />}
          {toast.type === 'error'   && <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5"    />}
          {toast.type === 'info'    && <Info         size={14} className="text-[#38bdf8] flex-shrink-0 mt-0.5" />}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-[#d4e8d4]">{toast.title}</p>
            <p className="text-[10px] text-[#3d6040] mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#3d6040] hover:text-[#d4e8d4] transition-colors flex-shrink-0"
          >
            <X size={11} />
          </button>
        </div>
      ))}
    </div>
  )
}
