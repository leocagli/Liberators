'use client'

import Image from 'next/image'
import { Shield, Database, Globe, Clock, Copy, ExternalLink, RefreshCw, Upload, Info } from 'lucide-react'
import { useDashboard } from './dashboard-context'

const TOTAL_SEGMENTS = 28

export function AgentCard() {
  const { activeAgent, setBackupModal, setReviveModal, copyToClipboard, addToast } = useDashboard()
  const filledSegments = Math.round((activeAgent.integrityScore / 100) * TOTAL_SEGMENTS)

  const scoreColor =
    activeAgent.integrityScore >= 90
      ? 'text-[#00f080]'
      : activeAgent.integrityScore >= 70
      ? 'text-[#f59e0b]'
      : 'text-[#ef4444]'

  const barColor =
    activeAgent.integrityScore >= 90
      ? 'bg-[#00f080]'
      : activeAgent.integrityScore >= 70
      ? 'bg-[#f59e0b]'
      : 'bg-[#ef4444]'

  return (
    <div className="relative border border-[#162816] rounded-lg bg-[#0b1510] overflow-hidden">
      {/* Subtle top accent line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00f080]/30 to-transparent" />

      <div className="p-5">
        {/* Top row */}
        <div className="flex gap-5 mb-5">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-[136px] h-[136px] rounded-lg overflow-hidden border border-[#162816] bg-[#060b06] relative">
              <Image
                src={activeAgent.avatar}
                alt={`${activeAgent.name} avatar`}
                width={136}
                height={136}
                className="w-full h-full object-cover transition-all duration-500"
                key={activeAgent.id}
              />
              {/* Corner glow */}
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-[#00f080]/10" />
            </div>
            {/* Active dot */}
            {activeAgent.status === 'ACTIVE' && (
              <span className="absolute bottom-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f080] opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f080]" />
              </span>
            )}
          </div>

          {/* Name + badges + integrity */}
          <div className="flex-1 min-w-0">
            {/* Name row */}
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <h2 className="text-[1.4rem] font-bold text-[#d4e8d4] tracking-wider uppercase leading-none">
                {activeAgent.name}
              </h2>
              <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold tracking-[0.12em] uppercase border ${
                activeAgent.status === 'ACTIVE'
                  ? 'bg-[#00f080]/10 text-[#00f080] border-[#00f080]/25'
                  : activeAgent.status === 'GUARDIAN'
                  ? 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/25'
                  : 'bg-[#3d6040]/10 text-[#3d6040] border-[#3d6040]/25'
              }`}>
                {activeAgent.status}
              </span>
              <span className="px-2 py-0.5 rounded-sm text-[9px] font-mono text-[#3d6040] border border-[#162816] bg-[#060b06]">
                {activeAgent.version}
              </span>
            </div>

            {/* Integrity score */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] font-bold tracking-[0.15em] text-[#3d6040] uppercase">
                  Integrity Score
                </span>
                <button
                  onClick={() => addToast('info', 'Integrity Score', 'Measures whether this agent can evolve safely without losing its recoverable Soul state.')}
                  className="text-[#3d6040] hover:text-[#00f080] transition-colors"
                >
                  <Info size={9} />
                </button>
              </div>

              <div className={`text-[2.6rem] font-bold leading-none mb-2.5 tracking-tight ${scoreColor} neon-glow-text`}>
                {activeAgent.integrityScore}%
              </div>

              {/* Segmented bar */}
              <div className="flex gap-[2.5px] mb-1.5">
                {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-[7px] w-[13px] rounded-[1.5px] transition-colors ${
                      i < filledSegments ? barColor : 'bg-[#101d10] border border-[#162816]'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[9px] text-[#3d6040]">Threshold: 90%</span>
                <Info size={8} className="text-[#3d6040]" />
              </div>
            </div>
          </div>

          {/* Right meta column */}
          <div className="flex flex-col gap-3.5 min-w-[220px] border-l border-[#162816] pl-5">

            {/* Protected by */}
            <div className="flex items-start gap-2">
              <Shield size={13} className="text-[#3d6040] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-bold tracking-[0.12em] text-[#3d6040] uppercase mb-0.5">Protected By</p>
                <p className={`text-[11px] font-bold ${activeAgent.protectedBy === 'None' ? 'text-[#3d6040]' : 'text-[#00f080]'}`}>
                  {activeAgent.protectedBy}
                </p>
              </div>
            </div>

            {/* Last backup */}
            <div className="flex items-start gap-2">
              <Clock size={13} className="text-[#3d6040] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-bold tracking-[0.12em] text-[#3d6040] uppercase mb-0.5">Last Decentralized Backup</p>
                <p className="text-[11px] font-semibold text-[#d4e8d4]">{activeAgent.lastBackup}</p>
                <p className="text-[9px] text-[#3d6040] font-mono mt-0.5">{activeAgent.block}</p>
              </div>
            </div>

            {/* Soul ID */}
            <div className="flex items-start gap-2">
              <Database size={13} className="text-[#3d6040] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-bold tracking-[0.12em] text-[#3d6040] uppercase mb-0.5">Soul ID</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-[#d4e8d4]">{activeAgent.soulId}</span>
                  <button
                    onClick={() => copyToClipboard(activeAgent.soulId, 'Soul ID')}
                    className="text-[#3d6040] hover:text-[#00f080] transition-colors"
                    title="Copy Soul ID"
                  >
                    <Copy size={9} />
                  </button>
                </div>
              </div>
            </div>

            {/* Arkiv gate */}
            <div className="flex items-start gap-2">
              <Globe size={13} className="text-[#3d6040] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[9px] font-bold tracking-[0.12em] text-[#3d6040] uppercase mb-0.5">Arkiv Gate</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-[#d4e8d4]">{activeAgent.arkivGate}</span>
                  <button
                    onClick={() => addToast('info', 'Arkiv Gate', `Opening ${activeAgent.arkivGate}`)}
                    className="text-[#3d6040] hover:text-[#00f080] transition-colors"
                    title="Open Arkiv Gate"
                  >
                    <ExternalLink size={9} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setBackupModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md border border-[#00f080]/40 text-[11px] font-bold tracking-[0.12em] uppercase text-[#00f080] bg-[#00f080]/5 hover:bg-[#00f080]/10 hover:border-[#00f080]/60 hover:shadow-[0_0_12px_rgba(0,240,128,0.12)] active:scale-[0.98] transition-all duration-150"
          >
            <Upload size={13} />
            Backup Evolution Soul
          </button>
          <button
            onClick={() => setReviveModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md border border-[#162816] text-[11px] font-bold tracking-[0.12em] uppercase text-[#d4e8d4]/60 bg-[#060b06] hover:bg-[#0d180d] hover:border-[#1e3c1e] hover:text-[#d4e8d4] active:scale-[0.98] transition-all duration-150"
          >
            <RefreshCw size={13} />
            Revive From Arkiv
          </button>
        </div>
      </div>
    </div>
  )
}
