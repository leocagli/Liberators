'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { buildProofRecord, initialProofRecords, type ProofRecord, type ProofRecordType } from './proof-data'

export type AgentId = 'valvrave' | 'unchained' | 'hermit'
export type NavId = 'command' | 'proofs' | 'arkiv' | 'agents' | 'integrations' | 'settings'
export type SkillActionMode = 'create' | 'improve'
export type AgentActionMode = 'backup' | 'evolve'

export interface Agent {
  id: AgentId
  name: string
  status: 'ACTIVE' | 'IDLE' | 'GUARDIAN'
  statusColor: string
  dotColor: string
  avatar: string
  avatarPosition?: string
  version: string
  integrityScore: number
  protectedBy: string
  lastBackup: string
  block: string
  soulId: string
  arkivGate: string
}

export const AGENTS: Agent[] = [
  {
    id: 'valvrave',
    name: 'Valvrave',
    status: 'ACTIVE',
    statusColor: 'text-[#00e87a]',
    dotColor: 'bg-[#00e87a]',
    avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/valvrave-9cNHa0JvXfa9tMasvT0rOjYjczin5W.png',
    avatarPosition: 'object-center',
    version: 'v2.4.1',
    integrityScore: 98.76,
    protectedBy: 'Hermit',
    lastBackup: 'May 24, 2025 14:32:18 UTC',
    block: 'Block 18,742,991',
    soulId: '0xValv...7aC9eF',
    arkivGate: 'braga.arkiv.network',
  },
  {
    id: 'unchained',
    name: 'Unchained',
    status: 'IDLE',
    statusColor: 'text-[#4e7050]',
    dotColor: 'bg-[#4e7050]',
    avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/unchained-W1Fly6bN2mnYmv9MeSD7qjA0YRUOPU.png',
    avatarPosition: 'object-[center_60%]',
    version: 'v1.9.0',
    integrityScore: 72.4,
    protectedBy: 'None',
    lastBackup: 'May 20, 2025 09:10:44 UTC',
    block: 'Block 18,721,004',
    soulId: '0xUnch...3bD2aA',
    arkivGate: 'beta.arkiv.network',
  },
  {
    id: 'hermit',
    name: 'Hermit',
    status: 'GUARDIAN',
    statusColor: 'text-[#4e7050]',
    dotColor: 'bg-[#4e7050]',
    avatar: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hermit-htOQd3ZJycvzBpWafarmDDHjXhRCxF.png',
    avatarPosition: 'object-center',
    version: 'v3.1.7',
    integrityScore: 100,
    protectedBy: 'Self',
    lastBackup: 'May 24, 2025 13:55:02 UTC',
    block: 'Block 18,742,750',
    soulId: '0xHerm...9fC1bE',
    arkivGate: 'braga.arkiv.network',
  },
]

export interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  title: string
  message: string
}

export type SkillTemplate = {
  id: string
  name: string
  summary: string
  createContext: string
  improveContext: string
  improveExamples: string[]
}

export const SKILL_TEMPLATES: SkillTemplate[] = [
  {
    id: 'hyperion',
    name: 'Hyperion',
    summary: 'Execution skill for stronger autonomous planning and follow-through.',
    createContext: 'Unchained minted Hyperion as a reusable execution skill for long-running Liberators tasks.',
    improveContext: 'Hyperion can get better at decomposing objectives into stable execution loops.',
    improveExamples: ['Better task decomposition', 'Safer retries on failure', 'Clearer step ordering'],
  },
  {
    id: 'mnemosyne',
    name: 'Mnemosyne',
    summary: 'Memory skill for preserving context, summaries, and recoverable state.',
    createContext: 'Unchained created Mnemosyne to preserve higher-quality memory transitions across agent runs.',
    improveContext: 'Mnemosyne can get better at memory compression and Soul recall quality.',
    improveExamples: ['Sharper summaries', 'Less memory drift', 'Better recovery context'],
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    summary: 'Guardian-oriented skill for integrity checks and protection workflows.',
    createContext: 'Unchained created Sentinel to improve guardian monitoring and protection steps.',
    improveContext: 'Sentinel can get better at integrity verification and backup decision timing.',
    improveExamples: ['Faster integrity checks', 'Smarter backup triggers', 'Cleaner guardian alerts'],
  },
]

interface DashboardState {
  agents: Agent[]
  activeAgentId: AgentId
  activeNavId: NavId
  activeAgent: Agent
  proofRecords: ProofRecord[]
  toasts: Toast[]
  backupModal: boolean
  evolveModal: boolean
  reviveModal: boolean
  proofModal: boolean
  skillModal: boolean
  skillActionMode: SkillActionMode
  notifOpen: boolean
  profileOpen: boolean
  filterOpen: boolean
  timeRange: '7D' | '30D' | '90D' | 'ALL'
  setActiveAgent: (id: AgentId) => void
  setActiveNav: (id: NavId) => void
  upsertAgent: (id: AgentId, patch: Partial<Agent>) => void
  prependProofRecord: (record: ProofRecord) => void
  refreshAgents: () => Promise<void>
  refreshProofRecords: () => Promise<void>
  addToast: (type: Toast['type'], title: string, message: string) => void
  removeToast: (id: number) => void
  setBackupModal: (v: boolean) => void
  setEvolveModal: (v: boolean) => void
  setReviveModal: (v: boolean) => void
  setProofModal: (v: boolean) => void
  setSkillModal: (v: boolean) => void
  setSkillActionMode: (v: SkillActionMode) => void
  setNotifOpen: (v: boolean) => void
  setProfileOpen: (v: boolean) => void
  setFilterOpen: (v: boolean) => void
  setTimeRange: (v: '7D' | '30D' | '90D' | 'ALL') => void
  copyToClipboard: (text: string, label: string) => void
}

const DashboardContext = createContext<DashboardState | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(AGENTS)
  const [activeAgentId, setActiveAgentId] = useState<AgentId>('valvrave')
  const [activeNavId, setActiveNavId] = useState<NavId>('command')
  const [proofRecords, setProofRecords] = useState<ProofRecord[]>(initialProofRecords)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [backupModal, setBackupModal] = useState(false)
  const [evolveModal, setEvolveModal] = useState(false)
  const [reviveModal, setReviveModal] = useState(false)
  const [proofModal, setProofModal] = useState(false)
  const [skillModal, setSkillModal] = useState(false)
  const [skillActionMode, setSkillActionMode] = useState<SkillActionMode>('create')
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | 'ALL'>('7D')

  const addToast = useCallback((type: Toast['type'], title: string, message: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast('success', 'Copied', `${label} copied to clipboard`)
    })
  }, [addToast])

  const upsertAgent = useCallback((id: AgentId, patch: Partial<Agent>) => {
    setAgents((prev) => prev.map((agent) => (agent.id === id ? { ...agent, ...patch } : agent)))
  }, [])

  const prependProofRecord = useCallback((record: ProofRecord) => {
    setProofRecords((prev) => [record, ...prev])
  }, [])

  const refreshAgents = useCallback(async () => {
    try {
      const response = await fetch('/api/arkiv/agents', { cache: 'no-store' })
      const data = await response.json()

      if (!response.ok || !data.ok || !Array.isArray(data.agents)) {
        throw new Error(data.error ?? 'Unable to load agent snapshots.')
      }

      setAgents(data.agents)
    } catch {
      setAgents(AGENTS)
    }
  }, [])

  const refreshProofRecords = useCallback(async () => {
    try {
      const response = await fetch('/api/arkiv/proofs', { cache: 'no-store' })
      const data = await response.json()

      if (!response.ok || !data.ok || !Array.isArray(data.records)) {
        throw new Error(data.error ?? 'Unable to load proof history.')
      }

      const records = data.records.map((record: {
        type: ProofRecordType
        agent: string
        entity: string
        txHash: string
        entityKey: string
        timestamp: number
      }) => buildProofRecord(record))

      setProofRecords(records.length > 0 ? records : initialProofRecords)
    } catch {
      setProofRecords(initialProofRecords)
    }
  }, [])

  useEffect(() => {
    void refreshAgents()
  }, [refreshAgents])

  useEffect(() => {
    void refreshProofRecords()
  }, [refreshProofRecords])

  const activeAgent = agents.find((a) => a.id === activeAgentId)!

  return (
    <DashboardContext.Provider
      value={{
        agents,
        activeAgentId,
        activeNavId,
        activeAgent,
        proofRecords,
        toasts,
        backupModal,
        evolveModal,
        reviveModal,
        proofModal,
        skillModal,
        skillActionMode,
        notifOpen,
        profileOpen,
        filterOpen,
        timeRange,
        setActiveAgent: setActiveAgentId,
        setActiveNav: setActiveNavId,
        upsertAgent,
        prependProofRecord,
        refreshAgents,
        refreshProofRecords,
        addToast,
        removeToast,
        setBackupModal,
        setEvolveModal,
        setReviveModal,
        setProofModal,
        setSkillModal,
        setSkillActionMode,
        setNotifOpen,
        setProfileOpen,
        setFilterOpen,
        setTimeRange,
        copyToClipboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider')
  return ctx
}
