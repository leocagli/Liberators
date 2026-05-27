'use client'

import { ExternalLink, KeyRound, Link2, Network, Server, Shield, Sparkles, Wrench } from 'lucide-react'

import { proofQueryUrl } from './proof-data'
import { useDashboard } from './dashboard-context'

function Panel({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  icon: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <section className="border border-[#162816] rounded-lg bg-[#0b1510] p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-[10px] font-bold tracking-[0.12em] text-[#d4e8d4] uppercase">{title}</h3>
      </div>
      <p className="text-[11px] text-[#3d6040] leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-3 px-3 py-2 rounded-md border border-[#162816] text-[10px] font-bold uppercase tracking-widest text-[#d4e8d4]/70 hover:text-[#d4e8d4] hover:bg-[#0d180d] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </section>
  )
}

export function ArkivNetworkPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Panel
        title="Project Namespace"
        description='All writes and queries are scoped to `project = "liberators-arkiv-builder-2026"` so proofs stay isolated from other Arkiv apps.'
        icon={<KeyRound size={14} className="text-[#00f080]" />}
        actionLabel="Open Soul Proof Query"
        onAction={() => window.open(proofQueryUrl('soulBackupProof'), '_blank', 'noopener,noreferrer')}
      />
      <Panel
        title="Braga Runtime"
        description="Liberators writes to Arkiv Braga from server-side routes, then exposes proof links back into the dashboard for backup, evolution, and skill actions."
        icon={<Network size={14} className="text-[#38bdf8]" />}
        actionLabel="Open Agent Improvement Query"
        onAction={() => window.open(proofQueryUrl('agentImprovementProof'), '_blank', 'noopener,noreferrer')}
      />
    </div>
  )
}

export function AgentsPanel() {
  const { setActiveAgent, setActiveNav } = useDashboard()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Panel
        title="Valvrave"
        description="Primary action: evolve the agent and checkpoint self-improvement proofs."
        icon={<Sparkles size={14} className="text-[#f97316]" />}
        actionLabel="Focus Valvrave"
        onAction={() => {
          setActiveAgent('valvrave')
          setActiveNav('command')
        }}
      />
      <Panel
        title="Unchained"
        description="Primary actions: create skill and improve skill, both recorded as Arkiv entities."
        icon={<Wrench size={14} className="text-[#8b5cf6]" />}
        actionLabel="Focus Unchained"
        onAction={() => {
          setActiveAgent('unchained')
          setActiveNav('command')
        }}
      />
      <Panel
        title="Hermit"
        description="Primary action: protect the Soul with backup-first guardian flows and proof visibility."
        icon={<Shield size={14} className="text-[#38bdf8]" />}
        actionLabel="Focus Hermit"
        onAction={() => {
          setActiveAgent('hermit')
          setActiveNav('command')
        }}
      />
    </div>
  )
}

export function IntegrationsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Panel
        title="Privy"
        description="Client auth for Google login and wallet connect. The App ID is public and can ship via `NEXT_PUBLIC_PRIVY_APP_ID`."
        icon={<Link2 size={14} className="text-[#00f080]" />}
      />
      <Panel
        title="Arkiv Gate"
        description="Hermit can route proofs through Arkiv Gate when the guardian flow needs an external proof bridge."
        icon={<Server size={14} className="text-[#38bdf8]" />}
      />
      <Panel
        title="Hermes"
        description="Hermes stays external to Vercel and can call the dashboard APIs for backup, evolve, and revive commands."
        icon={<ExternalLink size={14} className="text-[#d4e8d4]" />}
      />
    </div>
  )
}

export function SettingsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Panel
        title="Deployment"
        description="Required server envs on Vercel: `ARKIV_PRIVATE_KEY`. Required public envs: `NEXT_PUBLIC_PRIVY_APP_ID`."
        icon={<Server size={14} className="text-[#00f080]" />}
      />
      <Panel
        title="Proof UX"
        description="The dashboard now prioritizes real proof rows produced by API writes instead of placeholder query-only rows."
        icon={<Shield size={14} className="text-[#38bdf8]" />}
      />
    </div>
  )
}
