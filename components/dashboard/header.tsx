'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Bell, Terminal, FileText, ChevronDown, User, ExternalLink, LogOut, Settings, Copy } from 'lucide-react'
import { AuthWalletControls } from './auth-wallet-controls'
import { useDashboard } from './dashboard-context'

const NOTIFICATIONS = [
  { id: 1, title: 'Soul Backup Complete', desc: 'Valvrave backed up at block 18,742,991', time: '2m ago', dot: 'bg-[#00f080]' },
  { id: 2, title: 'Guardian Integrity Check', desc: 'Hermit verified all agents successfully', time: '8m ago', dot: 'bg-[#38bdf8]' },
  { id: 3, title: 'New Proof Recorded', desc: 'skillLiberationProof added to chain', time: '34m ago', dot: 'bg-[#8b5cf6]' },
]

export function Header() {
  const { notifOpen, setNotifOpen, profileOpen, setProfileOpen, addToast, copyToClipboard } = useDashboard()

  const notifRef   = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (notifOpen   && notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotifOpen(false)
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [notifOpen, profileOpen, setNotifOpen, setProfileOpen])

  return (
    <header className="h-[52px] flex items-center border-b border-[#162816] bg-[#07100a] px-5 gap-4 flex-shrink-0 relative z-30">

      {/* Title block */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-7 h-7 flex items-center justify-center border border-[#00f080]/30 rounded bg-[#00f080]/5 flex-shrink-0 overflow-hidden">
          <Image src="/liberators-mark.svg" alt="Liberators logo" width={28} height={28} className="w-full h-full" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[11px] font-bold tracking-[0.15em] text-[#d4e8d4] uppercase leading-tight">
            Self-Evolving Agents
          </h1>
          <p className="text-[9px] text-[#3d6040] leading-tight tracking-wide">
            Evolution Loop + Arkiv Soul Backup
          </p>
        </div>
      </div>

      {/* Network status badge */}
      <div className="flex items-center gap-2 border border-[#162816] rounded-md px-3 py-1.5 bg-[#0b1510]">
        <div className="w-5 h-5 rounded-full border border-[#00f080]/30 flex items-center justify-center bg-[#00f080]/5">
          <User size={11} className="text-[#00f080]" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-[#d4e8d4] leading-tight">Arkiv Braga</p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f080]" />
            <span className="text-[9px] text-[#00f080] leading-none">Network Healthy</span>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-1.5">
        <AuthWalletControls />

        {/* Docs */}
        <a
          href="https://docs.arkiv.network"
          target="_blank"
          rel="noreferrer"
          onClick={() => addToast('info', 'Opening Docs', 'Redirecting to Arkiv Network documentation')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#162816] text-[10px] text-[#d4e8d4]/60 hover:text-[#d4e8d4] hover:border-[#1e3c1e] hover:bg-[#0b1510] transition-all"
        >
          <FileText size={11} />
          Docs
          <ExternalLink size={9} className="opacity-40" />
        </a>

        {/* CLI */}
        <button
          onClick={() => addToast('info', 'CLI Access', 'npm install -g @arkiv/cli  →  arkiv connect')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#162816] text-[10px] text-[#d4e8d4]/60 hover:text-[#d4e8d4] hover:border-[#1e3c1e] hover:bg-[#0b1510] transition-all"
        >
          <Terminal size={11} />
          CLI
        </button>

        {/* Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false) }}
            className={`w-8 h-8 rounded border flex items-center justify-center transition-all relative ${
              notifOpen
                ? 'border-[#00f080]/40 text-[#00f080] bg-[#00f080]/5'
                : 'border-[#162816] text-[#d4e8d4]/60 hover:text-[#d4e8d4] hover:border-[#1e3c1e] hover:bg-[#0b1510]'
            }`}
          >
            <Bell size={13} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#00f080] shadow-[0_0_4px_#00f080]" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-10 w-72 border border-[#162816] rounded-lg bg-[#0b1510] shadow-2xl z-50">
              <div className="px-4 py-2.5 border-b border-[#162816] flex items-center justify-between">
                <span className="text-[9px] font-bold tracking-[0.15em] text-[#3d6040] uppercase">Notifications</span>
                <span className="text-[9px] text-[#00f080] font-mono">3 new</span>
              </div>
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="flex items-start gap-2.5 px-4 py-3 border-b border-[#162816]/60 hover:bg-[#0d180d] transition-colors cursor-pointer">
                  <span className={`w-1.5 h-1.5 rounded-full mt-[5px] flex-shrink-0 ${n.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-[#d4e8d4]">{n.title}</p>
                    <p className="text-[10px] text-[#3d6040] mt-0.5 leading-relaxed">{n.desc}</p>
                  </div>
                  <span className="text-[9px] text-[#3d6040] whitespace-nowrap flex-shrink-0">{n.time}</span>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <button
                  onClick={() => { setNotifOpen(false); addToast('info', 'Notifications', 'All notifications marked as read') }}
                  className="text-[10px] text-[#3d6040] hover:text-[#00f080] transition-colors"
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
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded border transition-all ${
              profileOpen
                ? 'border-[#00f080]/40 text-[#00f080] bg-[#00f080]/5'
                : 'border-[#162816] text-[#d4e8d4]/60 hover:text-[#d4e8d4] hover:border-[#1e3c1e] hover:bg-[#0b1510]'
            }`}
          >
            <div className="w-5 h-5 rounded border border-[#00f080]/30 flex items-center justify-center bg-[#00f080]/5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            <ChevronDown size={11} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-10 w-52 border border-[#162816] rounded-lg bg-[#0b1510] shadow-2xl z-50">
              <div className="px-4 py-3 border-b border-[#162816]">
                <p className="text-[11px] font-bold text-[#d4e8d4]">Arkiv Braga</p>
                <p className="text-[9px] text-[#3d6040] mt-0.5 font-mono">Network Healthy</p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => { copyToClipboard('0x7A9F3c', 'Wallet address'); setProfileOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-[11px] text-[#d4e8d4]/60 hover:text-[#d4e8d4] hover:bg-[#0d180d] transition-colors"
                >
                  <Copy size={11} className="text-[#3d6040]" />
                  Copy Address
                </button>
                <button
                  onClick={() => { setProfileOpen(false); addToast('info', 'Settings', 'Settings panel coming soon') }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-[11px] text-[#d4e8d4]/60 hover:text-[#d4e8d4] hover:bg-[#0d180d] transition-colors"
                >
                  <Settings size={11} className="text-[#3d6040]" />
                  Account Settings
                </button>
                <div className="border-t border-[#162816] my-1" />
                <button
                  onClick={() => { setProfileOpen(false); addToast('info', 'Disconnected', 'Wallet disconnected from Arkiv Network') }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded text-[11px] text-red-400/70 hover:text-red-400 hover:bg-[#0d180d] transition-colors"
                >
                  <LogOut size={11} />
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
