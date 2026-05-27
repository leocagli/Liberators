'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { initialProofRecords, type ProofRecord } from './proof-data'

export type AgentId = 'valvrave' | 'unchained' | 'hermit'
export type NavId = 'command' | 'proofs' | 'arkiv' | 'agents' | 'integrations' | 'settings'

export interface Agent {
  id: AgentId
  name: string
  status: 'ACTIVE' | 'IDLE' | 'GUARDIAN'
  statusColor: string
  dotColor: string
  avatar: string
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
    avatar: '/valvrave.jpg',
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
    avatar: '/unchained.jpg',
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
    avatar: '/hermit.jpg',
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

interface DashboardState {
  agents: Agent[]
  activeAgentId: AgentId
  activeNavId: NavId
  activeAgent: Agent
  proofRecords: ProofRecord[]
  toasts: Toast[]
  backupModal: boolean
  reviveModal: boolean
  proofModal: boolean
  notifOpen: boolean
  profileOpen: boolean
  filterOpen: boolean
  timeRange: '7D' | '30D' | '90D' | 'ALL'
  setActiveAgent: (id: AgentId) => void
  setActiveNav: (id: NavId) => void
  upsertAgent: (id: AgentId, patch: Partial<Agent>) => void
  prependProofRecord: (record: ProofRecord) => void
  addToast: (type: Toast['type'], title: string, message: string) => void
  removeToast: (id: number) => void
  setBackupModal: (v: boolean) => void
  setReviveModal: (v: boolean) => void
  setProofModal: (v: boolean) => void
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
  const [reviveModal, setReviveModal] = useState(false)
  const [proofModal, setProofModal] = useState(false)
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
        reviveModal,
        proofModal,
        notifOpen,
        profileOpen,
        filterOpen,
        timeRange,
        setActiveAgent: setActiveAgentId,
        setActiveNav: setActiveNavId,
        upsertAgent,
        prependProofRecord,
        addToast,
        removeToast,
        setBackupModal,
        setReviveModal,
        setProofModal,
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
