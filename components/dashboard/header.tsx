'use client'

import { Bell, Terminal, FileText, Box, ChevronDown, User } from 'lucide-react'

export function Header() {
  return (
    <header className="h-14 flex items-center border-b border-[#1a2e1a] bg-[#0a130a] px-4 gap-4 flex-shrink-0">
      {/* Title */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 flex items-center justify-center border border-[#00e87a]/40 text-[#00e87a] rounded flex-shrink-0">
          <Box size={16} strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold tracking-widest text-[#dceadc] uppercase leading-tight">
            Soul Backup &amp; Revival
          </h1>
          <p className="text-[10px] text-[#4e7050] leading-tight">
            Soul Recovery Command Center
          </p>
        </div>
      </div>

      {/* User status - center */}
      <div className="flex items-center gap-2 border border-[#1a2e1a] rounded px-3 py-1.5 bg-[#0d160d]">
        <div className="w-6 h-6 rounded-full border border-[#00e87a]/50 flex items-center justify-center bg-[#0f1a0f]">
          <User size={12} className="text-[#00e87a]" />
        </div>
        <div>
          <p className="text-xs font-bold text-[#dceadc] leading-tight">
            Arkiv Braga
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e87a]" />
            <span className="text-[10px] text-[#00e87a]">Network Healthy</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1a2e1a] text-xs text-[#dceadc]/70 hover:text-[#dceadc] hover:border-[#2a3e2a] transition-colors bg-[#0d160d]">
          <FileText size={12} />
          Docs
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1a2e1a] text-xs text-[#dceadc]/70 hover:text-[#dceadc] hover:border-[#2a3e2a] transition-colors bg-[#0d160d]">
          <Terminal size={12} />
          CLI
        </button>
        <button className="w-8 h-8 rounded border border-[#1a2e1a] flex items-center justify-center text-[#dceadc]/70 hover:text-[#dceadc] hover:border-[#2a3e2a] transition-colors bg-[#0d160d]">
          <Bell size={14} />
        </button>
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded border border-[#1a2e1a] text-[#dceadc]/70 hover:text-[#dceadc] hover:border-[#2a3e2a] transition-colors bg-[#0d160d]">
          <div className="w-5 h-5 rounded border border-[#00e87a]/40 flex items-center justify-center">
            <Box size={12} className="text-[#00e87a]" />
          </div>
          <ChevronDown size={12} />
        </button>
      </div>
    </header>
  )
}
