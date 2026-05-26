'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { X, Upload, RefreshCw, Shield, ExternalLink, CheckCircle, Loader2 } from 'lucide-react'
import { proofRecords } from './proof-data'
import { useDashboard } from './dashboard-context'

/* ── Backup Soul Modal ─────────────────────────────────────────── */
export function BackupModal() {
  const { backupModal, setBackupModal, activeAgent, addToast } = useDashboard()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [result, setResult] = useState<{ entityKey: string; txHash: string; entityExplorerUrl: string } | null>(null)

  if (!backupModal) return null

  const handleBackup = async () => {
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/arkiv/soul-backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          liberatorName: activeAgent.id,
          version: activeAgent.version,
          integrityScore: activeAgent.integrityScore,
        }),
      })
      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? 'Backup failed.')
      }

      setResult(data)
      setDone(true)
      addToast('success', 'Backup Written', `${activeAgent.name} soulBackup recorded on data.arkiv`)
    } catch (error) {
      addToast('error', 'Backup Failed', error instanceof Error ? error.message : 'Unable to write backup.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Overlay onClose={() => { if (!loading) setBackupModal(false) }}>
      <div className="w-full max-w-sm">
        <ModalHeader
          title="Backup Soul"
          icon={<Upload size={14} className="text-[#00f080]" />}
          onClose={() => setBackupModal(false)}
          disabled={loading}
          accent="#00f080"
        />
        <div className="p-5">
          <p className="text-[11px] text-[#3d6040] leading-relaxed mb-4">
            Creating a decentralized backup of{' '}
            <span className="text-[#d4e8d4] font-semibold">{activeAgent.name}</span>&apos;s soul
            state on Arkiv, linked to{' '}
            <span className="font-mono text-[#d4e8d4]">{activeAgent.block}</span>.
          </p>
          <div className="border border-[#162816] rounded-md p-3 bg-[#060b06] mb-5 flex flex-col gap-2">
            <Row label="Agent"     value={activeAgent.name} />
            <Row label="Version"   value={activeAgent.version} />
            <Row label="Arkiv Gate" value={activeAgent.arkivGate} />
            <Row label="Integrity" value={`${activeAgent.integrityScore}%`} highlight />
            {result && (
              <>
                <Row label="Entity" value={`${result.entityKey.slice(0, 10)}...${result.entityKey.slice(-6)}`} highlight />
                <Row label="TX" value={`${result.txHash.slice(0, 10)}...${result.txHash.slice(-6)}`} highlight />
              </>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setBackupModal(false)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-md border border-[#162816] text-[10px] font-bold uppercase tracking-widest text-[#3d6040] hover:text-[#d4e8d4] transition-colors disabled:opacity-40"
            >
              {done ? 'Close' : 'Cancel'}
            </button>
            <button
              onClick={handleBackup}
              disabled={loading || done}
              className="flex-1 py-2.5 rounded-md border border-[#00f080]/40 text-[10px] font-bold uppercase tracking-widest text-[#00f080] bg-[#00f080]/5 hover:bg-[#00f080]/10 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <><Loader2 size={12} className="animate-spin" /> Backing Up...</>
              ) : done ? (
                <><CheckCircle size={12} /> Done</>
              ) : (
                <><Upload size={12} /> Confirm Backup</>
              )}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  )
}

/* ── Revive From Arkiv Modal ───────────────────────────────────── */
export function ReviveModal() {
  const { reviveModal, setReviveModal, activeAgent, addToast } = useDashboard()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ entityKey: string; txHash: string } | null>(null)

  if (!reviveModal) return null

  const handleRevive = async () => {
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('/api/arkiv/revive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liberatorName: activeAgent.id }),
      })
      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.error ?? 'Revival failed.')
      }

      setResult(data)
      addToast('success', 'Revival Written', `${activeAgent.name} revival checkpoint recorded on Arkiv`)
    } catch (error) {
      addToast('error', 'Revival Failed', error instanceof Error ? error.message : 'Unable to revive from Arkiv.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Overlay onClose={() => { if (!loading) setReviveModal(false) }}>
      <div className="w-full max-w-sm">
        <ModalHeader
          title="Revive From Arkiv"
          icon={<RefreshCw size={14} className="text-[#d4e8d4]" />}
          onClose={() => setReviveModal(false)}
          disabled={loading}
        />
        <div className="p-5">
          <div className="border border-yellow-600/25 bg-yellow-900/10 rounded-md p-3 mb-4">
            <p className="text-[11px] text-yellow-400/90 leading-relaxed">
              Warning: This terminates the current runtime and reinstantiates{' '}
              <span className="font-semibold">{activeAgent.name}</span> from the last verified backup.
            </p>
          </div>
          <div className="border border-[#162816] rounded-md p-3 bg-[#060b06] mb-5 flex flex-col gap-2">
            <Row label="Last Backup"   value={activeAgent.lastBackup} />
            <Row label="Restore Point" value={activeAgent.block} />
            <Row label="Verified By"   value={activeAgent.protectedBy === 'None' ? 'Unprotected' : activeAgent.protectedBy} />
            {result && (
              <>
                <Row label="Revived Soul" value={`${result.entityKey.slice(0, 10)}...${result.entityKey.slice(-6)}`} highlight />
                <Row label="TX" value={`${result.txHash.slice(0, 10)}...${result.txHash.slice(-6)}`} highlight />
              </>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setReviveModal(false)}
              disabled={loading}
              className="flex-1 py-2.5 rounded-md border border-[#162816] text-[10px] font-bold uppercase tracking-widest text-[#3d6040] hover:text-[#d4e8d4] transition-colors disabled:opacity-40"
            >
              {result ? 'Close' : 'Cancel'}
            </button>
            <button
              onClick={handleRevive}
              disabled={loading}
              className="flex-1 py-2.5 rounded-md border border-[#d4e8d4]/20 text-[10px] font-bold uppercase tracking-widest text-[#d4e8d4] bg-[#101d10] hover:bg-[#162816] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <><Loader2 size={12} className="animate-spin" /> Reviving...</>
              ) : (
                <><RefreshCw size={12} /> Confirm Revival</>
              )}
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  )
}

/* ── All Proofs Modal ──────────────────────────────────────────── */
export function ProofModal() {
  const { proofModal, setProofModal } = useDashboard()

  if (!proofModal) return null

  return (
    <Overlay onClose={() => setProofModal(false)}>
      <div className="w-full max-w-4xl">
        <ModalHeader
          title="All Proof Records"
          icon={<Shield size={14} className="text-[#38bdf8]" />}
          onClose={() => setProofModal(false)}
          accent="#38bdf8"
        />
        <div className="p-5 overflow-auto max-h-[60vh]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#162816]">
                {['Proof Type', 'Agent', 'Entity', 'TX', 'Data.Arkiv Link', 'Time (UTC)'].map((h) => (
                  <th key={h} className="pb-2.5 text-left text-[8px] font-bold tracking-[0.15em] text-[#3d6040] uppercase whitespace-nowrap px-2 first:pl-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {proofRecords.map((p, i) => (
                <tr key={i} className="border-b border-[#162816]/40 hover:bg-[#0d180d] transition-colors">
                  <td className="py-2.5 px-2 first:pl-0">
                    <div className="flex items-center gap-1.5">
                      <p.icon size={10} className={p.iconColor} />
                      <span className={`text-[10px] font-mono font-semibold ${p.typeColor}`}>{p.type}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-[10px] text-[#d4e8d4]">{p.agent}</td>
                  <td className="py-2.5 px-2 text-[10px] text-[#d4e8d4]">{p.entity}</td>
                  <td className="py-2.5 px-2">
                    <button
                      onClick={() => window.open(p.txUrl, '_blank', 'noopener,noreferrer')}
                      className="text-[10px] font-mono text-[#d4e8d4]/50 hover:text-[#00f080]"
                    >
                      {p.tx}
                    </button>
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => window.open(p.dataUrl, '_blank', 'noopener,noreferrer')}
                        className="text-[10px] font-mono text-[#00f080] hover:underline"
                      >
                        {p.dataLink}
                      </button>
                      <ExternalLink size={8} className="text-[#3d6040]" />
                    </div>
                  </td>
                  <td className="py-2.5 px-2">
                    <span className="text-[10px] font-mono text-[#3d6040] whitespace-nowrap">{p.time}</span>
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

/* ── Shared primitives ─────────────────────────────────────────── */
function Overlay({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full border border-[#162816] rounded-xl bg-[#0b1510] shadow-2xl"
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
  accent,
}: {
  title: string
  icon: ReactNode
  onClose: () => void
  disabled?: boolean
  accent?: string
}) {
  return (
    <div className="relative flex items-center justify-between px-5 py-4 border-b border-[#162816]">
      {accent && (
        <div className="absolute inset-x-0 top-0 h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${accent}40, transparent)` }} />
      )}
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-[10px] font-bold tracking-[0.15em] text-[#d4e8d4] uppercase">{title}</h2>
      </div>
      <button
        onClick={onClose}
        disabled={disabled}
        className="text-[#3d6040] hover:text-[#d4e8d4] transition-colors disabled:opacity-40"
      >
        <X size={13} />
      </button>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[9px] text-[#3d6040]">{label}</span>
      <span className={`text-[9px] font-mono ${highlight ? 'text-[#00f080] font-bold' : 'text-[#d4e8d4]/70'}`}>
        {value}
      </span>
    </div>
  )
}
