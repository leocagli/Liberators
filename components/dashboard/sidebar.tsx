'use client'

import Image from 'next/image'
import {
  Monitor,
  Shield,
  Network,
  Users,
  Puzzle,
  Settings,
  Copy,
  Box,
} from 'lucide-react'
import { useDashboard, AGENTS, type AgentId, type NavId } from './dashboard-context'

const navItems: { id: NavId; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }[] = [
  { id: 'command', label: 'Command Center', icon: Monitor },
  { id: 'proofs', label: 'Proofs', icon: Shield },
  { id: 'arkiv', label: 'Arkiv Network', icon: Network },
  { id: 'agents', label: 'Agents', icon: Users },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const { activeAgentId, activeNavId, setActiveAgent, setActiveNav, copyToClipboard } = useDashboard()

  return (
    <aside className="w-[210px] min-w-[210px] h-screen flex flex-col bg-[#0a130a] border-r border-[#1a2e1a]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[#1a2e1a]">
        <div className="w-8 h-8 flex items-center justify-center border border-[#00e87a] text-[#00e87a] rounded">
          <Box size={16} strokeWidth={1.5} />
        </div>
        <span className="text-sm font-bold tracking-widest text-[#dceadc] uppercase">
          Liberators
        </span>
      </div>

      {/* Agents */}
      <div className="px-3 pt-4 pb-2">
        <p className="text-[10px] font-semibold tracking-widest text-[#4e7050] uppercase mb-2 px-1">
          Agents
        </p>
        <div className="flex flex-col gap-1">
          {AGENTS.map((agent) => {
            const isActive = agent.id === activeAgentId
            return (
              <button
                key={agent.id}
                onClick={() => setActiveAgent(agent.id as AgentId)}
                className={`flex items-center gap-2.5 px-2 py-2 rounded text-left transition-colors ${
                  isActive
                    ? 'bg-[#111f11] border border-[#00e87a]/30'
                    : 'hover:bg-[#0f1a0f] border border-transparent'
                }`}
              >
                <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 border border-[#1a2e1a]">
                  <Image
                    src={agent.avatar}
                    alt={agent.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${isActive ? 'text-[#00e87a]' : 'text-[#dceadc]'}`}>
                    {agent.name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.dotColor}`} />
                    <span className={`text-[10px] font-mono ${agent.statusColor}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-3 pt-4 pb-2">
        <p className="text-[10px] font-semibold tracking-widest text-[#4e7050] uppercase mb-2 px-1">
          Navigation
        </p>
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = item.id === activeNavId
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`flex items-center gap-2.5 px-2 py-2 rounded text-left text-xs transition-colors ${
                  isActive
                    ? 'text-[#00e87a] bg-[#0f1a0f]'
                    : 'text-[#dceadc]/70 hover:text-[#dceadc] hover:bg-[#0f1a0f]'
                }`}
              >
                <item.icon
                  size={14}
                  strokeWidth={1.5}
                  className={isActive ? 'text-[#00e87a]' : 'text-[#4e7050]'}
                />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Connected wallet */}
      <div className="px-3 pb-4">
        <div className="border border-[#1a2e1a] rounded p-2.5 bg-[#0d160d]">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e87a]" />
            <span className="text-[10px] font-semibold tracking-widest text-[#00e87a] uppercase">
              Connected
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#dceadc]/70">
              0x7A...9F3c
            </span>
            <button
              onClick={() => copyToClipboard('0x7A...9F3c', 'Wallet address')}
              className="text-[#4e7050] hover:text-[#00e87a] transition-colors"
              title="Copy wallet address"
            >
              <Copy size={10} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
