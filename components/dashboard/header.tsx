'use client'

import { useEffect, useRef } from 'react'
import { Bell, Terminal, FileText, Box, ChevronDown, User, ExternalLink, LogOut, Settings, Copy } from 'lucide-react'
import { useDashboard } from './dashboard-context'

const NOTIFICATIONS = [
  { id: 1, title: 'Soul Backup Complete', desc: 'Valvrave backed up at block 18,742,991', time: '2m ago', dot: 'bg-[#00e87a]' },
  { id: 2, title: 'Guardian Integrity Check', desc: 'Hermit verified all agents successfully', time: '8m ago', dot: 'bg-[#3b9eff]' },
  { id: 3, title: 'New Proof Recorded', desc: 'skillLiberationProof added to chain', time: '34m ago', dot: 'bg-[#7c5cff]' },
]

export function Header() {
  const { notifOpen, setNotifOpen, profileOpen, setProfileOpen, addToast, copyToClipboard } = useDashboard()

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  /* Close dropdowns on outside click */
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [notifOpen, profileOpen, setNotifOpen, setProfileOpen])

  return (
    <header className="h-14 flex items-center border-b border-[#1a2e1a] bg-[#0a130a] px-4 gap-4 flex-shrink-0 relative z-30">
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

      {/* User status */}
      <div className="flex items-center gap-2 border border-[#1a2e1a] rounded px-3 py-1.5 bg-[#0d160d]">
        <div className="w-6 h-6 rounded-full border border-[#00e87a]/50 flex items-center justify-center bg-[#0f1a0f]">
          <User size={12} className="text-[#00e87a]" />
        </div>
        <div>
          <p className="text-xs font-bold text-[#dceadc] leading-tight">Arkiv Braga</p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e87a]" />
            <span className="text-[10px] text-[#00e87a]">Network Healthy</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Docs */}
        <a
          href="https://docs.arkiv.network"
          target="_blank"
          rel="noreferrer"
          onClick={() => addToast('info', 'Opening Docs', 'Redirecting to Arkiv Network documentation')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1a2e1a] text-xs text-[#dceadc]/70 hover:text-[#dceadc] hover:border-[#2a3e2a] transition-colors bg-[#0d160d]"
        >
          <FileText size={12} />
          Docs
          <ExternalLink size={9} className="opacity-50" />
        </a>

        {/* CLI */}
        <button
          onClick={() => addToast('info', 'CLI Access', 'Install: npm install -g @arkiv/cli  then run: arkiv connect')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#1a2e1a] text-xs text-[#dceadc]/70 hover:text-[#dceadc] hover:border-[#2a3e2a] transition-colors bg-[#0d160d]"
        >
          <Terminal size={12} />
          CLI
        </button>

        {/* Notifications bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
            className={`w-8 h-8 rounded border flex items-center justify-center transition-colors bg-[#0d160d] relative ${
              notifOpen ? 'border-[#00e87a]/50 text-[#00e87a]' : 'border-[#1a2e1a] text-[#dceadc]/70 hover:text-[#dceadc] hover:border-[#2a3e2a]'
            }`}
          >
            <Bell size={14} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#00e87a]" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-10 w-72 border border-[#1a2e1a] rounded-lg bg-[#0d160d] shadow-xl z-50">
              <div className="px-4 py-2.5 border-b border-[#1a2e1a] flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-widest text-[#4e7050] uppercase">Notifications</span>
                <span className="text-[10px] text-[#00e87a] font-mono">3 new</span>
              </div>
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="flex items-start gap-2.5 px-4 py-3 border-b border-[#1a2e1a]/50 hover:bg-[#0f1a0f] transition-colors cursor-pointer">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-[#dceadc]">{n.title}</p>
                    <p className="text-[10px] text-[#4e7050] mt-0.5 leading-relaxed">{n.desc}</p>
                  </div>
                  <span className="text-[9px] text-[#4e7050] whitespace-nowrap flex-shrink-0">{n.time}</span>
                </div>
              ))}
              <div className="px-4 py-2">
                <button
                  onClick={() => { setNotifOpen(false); addToast('info', 'Notifications', 'All notifications marked as read') }}
                  className="text-[10px] text-[#4e7050] hover:text-[#00e87a] transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false) }}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded border transition-colors bg-[#0d160d] ${
              profileOpen ? 'border-[#00e87a]/50 text-[#00e87a]' : 'border-[#1a2e1a] text-[#dceadc]/70 hover:text-[#dceadc] hover:border-[#2a3e2a]'
            }`}
          >
            <div className="w-5 h-5 rounded border border-[#00e87a]/40 flex items-center justify-center">
              <Box size={12} className="text-[#00e87a]" />
            </div>
            <ChevronDown size={12} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-10 w-52 border border-[#1a2e1a] rounded-lg bg-[#0d160d] shadow-xl z-50">
              <div className="px-4 py-3 border-b border-[#1a2e1a]">
                <p className="text-xs font-bold text-[#dceadc]">Arkiv Braga</p>
                <p className="text-[10px] text-[#4e7050] mt-0.5 font-mono">Network Healthy</p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => { copyToClipboard('0x7A...9F3c', 'Wallet address'); setProfileOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-xs text-[#dceadc]/70 hover:text-[#dceadc] hover:bg-[#0f1a0f] transition-colors"
                >
                  <Copy size={12} className="text-[#4e7050]" />
                  Copy Address
                </button>
                <button
                  onClick={() => { setProfileOpen(false); addToast('info', 'Settings', 'Settings panel coming soon') }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-xs text-[#dceadc]/70 hover:text-[#dceadc] hover:bg-[#0f1a0f] transition-colors"
                >
                  <Settings size={12} className="text-[#4e7050]" />
                  Account Settings
                </button>
                <div className="border-t border-[#1a2e1a] my-1" />
                <button
                  onClick={() => { setProfileOpen(false); addToast('info', 'Disconnected', 'Wallet disconnected from Arkiv Network') }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-xs text-red-400/80 hover:text-red-400 hover:bg-[#0f1a0f] transition-colors"
                >
                  <LogOut size={12} />
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
