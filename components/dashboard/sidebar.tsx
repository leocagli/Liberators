'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import {
  Monitor,
  Shield,
  Network,
  Users,
  Puzzle,
  Settings,
  Copy,
} from 'lucide-react'
import { useDashboard, type AgentId, type NavId } from './dashboard-context'

const navItems: {
  id: NavId
  label: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}[] = [
  { id: 'command',      label: 'Command Center', icon: Monitor  },
  { id: 'proofs',       label: 'Proofs',         icon: Shield   },
  { id: 'arkiv',        label: 'Arkiv Network',  icon: Network  },
  { id: 'agents',       label: 'Agents',         icon: Users    },
  { id: 'integrations', label: 'Integrations',   icon: Puzzle   },
  { id: 'settings',     label: 'Settings',       icon: Settings },
]

export function Sidebar() {
  const { agents, activeAgentId, activeNavId, setActiveAgent, setActiveNav, copyToClipboard } = useDashboard()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    const syncWallet = () => setWalletAddress(window.localStorage.getItem('liberators.connectedWallet'))
    syncWallet()
    window.addEventListener('storage', syncWallet)
    const timer = window.setInterval(syncWallet, 1000)
    return () => {
      window.removeEventListener('storage', syncWallet)
      window.clearInterval(timer)
    }
  }, [])

  const compactWallet = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not linked'

  return (
    <aside className="w-[212px] min-w-[212px] h-screen flex flex-col bg-[#07100a] border-r border-[#162816]">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-[14px] border-b border-[#162816]">
        <div className="w-7 h-7 flex items-center justify-center border border-[#00f080]/40 rounded bg-[#00f080]/5 overflow-hidden">
          <Image src="/liberators-mark.svg" alt="Liberators logo" width={28} height={28} className="w-full h-full" />
        </div>
        <span className="text-[11px] font-bold tracking-[0.2em] text-[#d4e8d4] uppercase">
          Liberators
        </span>
      </div>

      {/* Agents section */}
      <div className="px-3 pt-5 pb-1">
        <p className="text-[9px] font-bold tracking-[0.18em] text-[#3d6040] uppercase mb-2.5 px-1">
          Agents
        </p>
        <div className="flex flex-col gap-1">
          {agents.map((agent) => {
            const isActive = agent.id === activeAgentId
            return (
              <button
                key={agent.id}
                onClick={() => {
                  setActiveAgent(agent.id as AgentId)
                  setActiveNav('command')
                }}
                className={`flex items-center gap-2.5 px-2 py-2 rounded-md text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-[#0d1a0d] border border-[#00f080]/20'
                    : 'hover:bg-[#0d180d] border border-transparent'
                }`}
              >
                <div className={`w-8 h-8 rounded-md overflow-hidden flex-shrink-0 ${isActive ? 'avatar-active-ring' : 'border border-[#162816]'}`}>
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className={`text-[11px] font-semibold truncate leading-tight ${isActive ? 'text-[#00f080]' : 'text-[#d4e8d4]'}`}>
                    {agent.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.dotColor}`} />
                    <span className={`text-[9px] font-mono tracking-wider ${agent.statusColor}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 my-3 border-t border-[#162816]" />

      {/* Navigation section */}
      <div className="px-3">
        <p className="text-[9px] font-bold tracking-[0.18em] text-[#3d6040] uppercase mb-2 px-1">
          Navigation
        </p>
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = item.id === activeNavId
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-2.5 px-2 py-[7px] rounded-md text-left text-[11px] transition-all duration-150 ${
                  isActive
                    ? 'text-[#00f080] bg-[#0d1a0d]'
                    : 'text-[#d4e8d4]/60 hover:text-[#d4e8d4] hover:bg-[#0d180d]'
                }`}
              >
                <item.icon
                  size={13}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={isActive ? 'text-[#00f080]' : 'text-[#3d6040]'}
                />
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1 h-4 rounded-full bg-[#00f080]" />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Connected wallet */}
      <div className="px-3 pb-4">
        <div className="border border-[#162816] rounded-md p-2.5 bg-[#0b1510]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f080] opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f080]" />
            </span>
            <span className={`text-[9px] font-bold tracking-[0.15em] uppercase ${walletAddress ? 'text-[#00f080]' : 'text-[#3d6040]'}`}>
              {walletAddress ? 'Connected' : 'Wallet'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-[#d4e8d4]/60">
              {compactWallet}
            </span>
            {walletAddress && (
              <button
                onClick={() => copyToClipboard(walletAddress, 'Wallet address')}
                className="text-[#3d6040] hover:text-[#00f080] transition-colors"
                title="Copy wallet address"
              >
                <Copy size={10} />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
