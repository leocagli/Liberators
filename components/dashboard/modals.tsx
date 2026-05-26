'use client'

import { useState } from 'react'
import { X, Upload, RefreshCw, Shield, ExternalLink, Leaf, Zap, Database, CheckCircle, Loader2 } from 'lucide-react'
import { useDashboard } from './dashboard-context'

/* ---------- Backup Soul Modal ---------- */
export function BackupModal() {
  const { backupModal, setBackupModal, activeAgent, addToast } = useDashboard()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (!backupModal) return null

  const handleBackup = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 2200))
    setLoading(false)
    setDone(true)
    await new Promise((r) => setTimeout(r, 900))
    setDone(false)
    setBackupModal(false)
    addToast('success', 'Backup Successful', `${activeAgent.name} soul backed up to Arkiv Braga`)
  }

  return (
    <Overlay onClose={() => { if (!loading) setBackupModal(false) }}>
      <div className="w-full max-w-sm">
        <ModalHeader title="Backup Soul" icon={<Upload size={15} className="text-[#00e87a]" />} onClose={() => setBackupModal(false)} disabled={loading} />
        <div className="p-5">
          <p className="text-xs text-[#4e7050] leading-relaxed mb-4">
            This will create a new decentralized backup of{' '}
            <span className="text-[#dceadc] font-semibold">{activeAgent.name}</span>&apos;s soul
            state on the Arkiv network, linked to block{' '}
            <span className="font-mono text-[#dceadc]">{activeAgent.block}</span>.
          </p>
          <div className="border border-[#1a2e1a] rounded p-3 bg-[#080d08] mb-5 flex flex-col gap-1.5">
            <Row label="Agent" value={activeAgent.name} />
            <Row label="Version" value={activeAgent.version} />
            <Row label="Arkiv Gate" value={activeAgent.arkivGate} />
            <Row label="Integrity" value={`${activeAgent.integrityScore}%`} highlight />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setBackupModal(false)}
              disabled={loading}
              className="flex-1 py-2 rounded border border-[#1a2e1a] text-xs font-semibold uppercase tracking-widest text-[#4e7050] hover:text-[#dceadc] transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleBackup}
              disabled={loading || done}
              className="flex-1 py-2 rounded border border-[#00e87a] text-xs font-bold uppercase tracking-widest text-[#00e87a] bg-[#00e87a]/5 hover:bg-[#00e87a]/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <><Loader2 size={13} className="animate-spin" /> Backing Up...</>
              ) : done ? (
                <><CheckCircle size={13} /> Done</>
              ) : (
                <><Upload size={13} /> Confirm Backup</>
              )}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  )
}

/* ---------- Revive From Arkiv Modal ---------- */
export function ReviveModal() {
  const { reviveModal, setReviveModal, activeAgent, addToast } = useDashboard()
  const [loading, setLoading] = useState(false)

  if (!reviveModal) return null

  const handleRevive = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 2800))
    setLoading(false)
    setReviveModal(false)
    addToast('success', 'Revival Initiated', `${activeAgent.name} is being reinstantiated in a new runtime`)
  }

  return (
    <Overlay onClose={() => { if (!loading) setReviveModal(false) }}>
      <div className="w-full max-w-sm">
        <ModalHeader title="Revive From Arkiv" icon={<RefreshCw size={15} className="text-[#dceadc]" />} onClose={() => setReviveModal(false)} disabled={loading} />
        <div className="p-5">
          <div className="border border-yellow-600/30 bg-yellow-900/10 rounded p-3 mb-4">
            <p className="text-[11px] text-yellow-400 leading-relaxed">
              Warning: This will terminate the current runtime and reinstantiate{' '}
              <span className="font-semibold">{activeAgent.name}</span> from the last verified backup.
            </p>
          </div>
          <div className="border border-[#1a2e1a] rounded p-3 bg-[#080d08] mb-5 flex flex-col gap-1.5">
            <Row label="Last Backup" value={activeAgent.lastBackup} />
            <Row label="Restore Point" value={activeAgent.block} />
            <Row label="Verified By" value={activeAgent.protectedBy === 'None' ? 'Unprotected' : activeAgent.protectedBy} />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setReviveModal(false)}
              disabled={loading}
              className="flex-1 py-2 rounded border border-[#1a2e1a] text-xs font-semibold uppercase tracking-widest text-[#4e7050] hover:text-[#dceadc] transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleRevive}
              disabled={loading}
              className="flex-1 py-2 rounded border border-[#dceadc]/30 text-xs font-bold uppercase tracking-widest text-[#dceadc] bg-[#111f11] hover:bg-[#1a2e1a] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <><Loader2 size={13} className="animate-spin" /> Reviving...</>
              ) : (
                <><RefreshCw size={13} /> Confirm Revival</>
              )}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  )
}

/* ---------- View All Proofs Modal ---------- */
const ALL_PROOFS = [
  { type: 'evolutionProof', color: 'text-[#00e87a]', Icon: Leaf, agent: 'Valvrave', entity: 'Evolution v2.4.1', tx: '0x1a2b...7c9d3e', link: 'data.arkiv://braga/18742991/evo/1a2b', time: 'May 24, 2025 14:32:18' },
  { type: 'skillLiberationProof', color: 'text-[#7c5cff]', Icon: Zap, agent: 'Valvrave', entity: 'Skill Set: Hyperion', tx: '0x3f4d...9a8b2c', link: 'data.arkiv://braga/18742800/skill/3f4d', time: 'May 24, 2025 13:57:41' },
  { type: 'guardianIntegrityProof', color: 'text-[#3b9eff]', Icon: Shield, agent: 'Hermit', entity: 'Guardian v3.1.7', tx: '0x7e1b...a1b4f8', link: 'data.arkiv://braga/18742750/guard/7e1b', time: 'May 24, 2025 13:55:02' },
  { type: 'soulBackupProof', color: 'text-[#ffa940]', Icon: Database, agent: 'Valvrave', entity: 'Soul Backup v2.4.1', tx: '0x9c8d...4e7f1a', link: 'data.arkiv://braga/18742991/backup/9c8d', time: 'May 24, 2025 14:32:18' },
  { type: 'evolutionProof', color: 'text-[#00e87a]', Icon: Leaf, agent: 'Unchained', entity: 'Evolution v1.9.0', tx: '0x2b3c...8d0e1f', link: 'data.arkiv://braga/18721004/evo/2b3c', time: 'May 20, 2025 09:10:44' },
  { type: 'soulBackupProof', color: 'text-[#ffa940]', Icon: Database, agent: 'Unchained', entity: 'Soul Backup v1.9.0', tx: '0x4d5e...0f1a2b', link: 'data.arkiv://braga/18721004/backup/4d5e', time: 'May 20, 2025 09:10:44' },
]

export function ProofModal() {
  const { proofModal, setProofModal } = useDashboard()

  if (!proofModal) return null

  return (
    <Overlay onClose={() => setProofModal(false)}>
      <div className="w-full max-w-3xl">
        <ModalHeader title="All Proof Records" icon={<Shield size={15} className="text-[#3b9eff]" />} onClose={() => setProofModal(false)} />
        <div className="p-5 overflow-auto max-h-[60vh]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a2e1a]">
                {['Proof Type', 'Agent', 'Entity', 'TX', 'Data.Arkiv Link', 'Time (UTC)'].map((h) => (
                  <th key={h} className="pb-2.5 text-left text-[9px] font-semibold tracking-widest text-[#4e7050] uppercase whitespace-nowrap px-2 first:pl-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_PROOFS.map((p, i) => (
                <tr key={i} className="border-b border-[#1a2e1a]/50 hover:bg-[#0f1a0f] transition-colors">
                  <td className="py-2.5 px-2 first:pl-0">
                    <div className="flex items-center gap-1.5">
                      <p.Icon size={11} className={p.color} />
                      <span className={`text-[11px] font-mono font-semibold ${p.color}`}>{p.type}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-[11px] text-[#dceadc]">{p.agent}</td>
                  <td className="py-2.5 px-2 text-[11px] text-[#dceadc]">{p.entity}</td>
                  <td className="py-2.5 px-2">
                    <span className="text-[11px] font-mono text-[#dceadc]/60">{p.tx}</span>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-mono text-[#00e87a]">{p.link}</span>
                      <ExternalLink size={9} className="text-[#4e7050]" />
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="text-[11px] font-mono text-[#4e7050] whitespace-nowrap">{p.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Overlay>
  )
}

/* ---------- Shared primitives ---------- */
function Overlay({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full border border-[#1a2e1a] rounded-xl bg-[#0d160d] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '100%' }}
      >
        {children}
      </div>
    </div>
  )
}

function ModalHeader({
  title,
  icon,
  onClose,
  disabled,
}: {
  title: string
  icon: ReactNode
  onClose: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a2e1a]">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xs font-bold tracking-widest text-[#dceadc] uppercase">{title}</h2>
      </div>
      <button
        onClick={onClose}
        disabled={disabled}
        className="text-[#4e7050] hover:text-[#dceadc] transition-colors disabled:opacity-40"
      >
        <X size={14} />
      </button>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] text-[#4e7050]">{label}</span>
      <span className={`text-[10px] font-mono ${highlight ? 'text-[#00e87a] font-semibold' : 'text-[#dceadc]/80'}`}>
        {value}
      </span>
    </div>
  )
}

import type { ReactNode } from 'react'
