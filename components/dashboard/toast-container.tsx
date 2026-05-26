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
          className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border bg-[#0d160d] border-[#1a2e1a] shadow-xl min-w-[280px] max-w-[360px] animate-in slide-in-from-right-4 fade-in duration-200"
        >
          {toast.type === 'success' && (
            <CheckCircle size={15} className="text-[#00e87a] flex-shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info size={15} className="text-[#3b9eff] flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#dceadc]">{toast.title}</p>
            <p className="text-[11px] text-[#4e7050] mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-[#4e7050] hover:text-[#dceadc] transition-colors flex-shrink-0"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}
