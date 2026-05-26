import { Database, Leaf, Shield, Trophy, Zap } from 'lucide-react'

const DATA_ARKIV_BASE_URL = 'https://data.arkiv.network'
const PROJECT = 'liberators-arkiv-builder-2026'

function queryUrl(query: string) {
  return `${DATA_ARKIV_BASE_URL}/?query=${encodeURIComponent(query)}`
}

function proofQueryUrl(proofType: string) {
  return queryUrl(`project = "${PROJECT}" && proofType = "${proofType}"`)
}

function txQueryUrl(txHash: string) {
  return queryUrl(txHash)
}

export const proofRecords = [
  {
    type: 'evolutionProof',
    typeColor: 'text-[#00f080]',
    icon: Leaf,
    iconColor: 'text-[#00f080]',
    agent: 'Valvrave',
    entity: 'Evolution proofs',
    tx: 'query',
    txUrl: proofQueryUrl('evolutionProof'),
    dataLink: 'data.arkiv.network/?query=evolutionProof',
    dataUrl: proofQueryUrl('evolutionProof'),
    time: 'Live query',
  },
  {
    type: 'skillLiberationProof',
    typeColor: 'text-[#8b5cf6]',
    icon: Zap,
    iconColor: 'text-[#8b5cf6]',
    agent: 'Unchained',
    entity: 'Skill proofs',
    tx: 'query',
    txUrl: proofQueryUrl('skillLiberationProof'),
    dataLink: 'data.arkiv.network/?query=skillLiberationProof',
    dataUrl: proofQueryUrl('skillLiberationProof'),
    time: 'Live query',
  },
  {
    type: 'guardianIntegrityProof',
    typeColor: 'text-[#38bdf8]',
    icon: Shield,
    iconColor: 'text-[#38bdf8]',
    agent: 'Hermit',
    entity: 'Guardian proofs',
    tx: 'query',
    txUrl: proofQueryUrl('guardianIntegrityProof'),
    dataLink: 'data.arkiv.network/?query=guardianIntegrityProof',
    dataUrl: proofQueryUrl('guardianIntegrityProof'),
    time: 'Live query',
  },
  {
    type: 'soulBackupProof',
    typeColor: 'text-[#f59e0b]',
    icon: Database,
    iconColor: 'text-[#f59e0b]',
    agent: 'Valvrave',
    entity: 'Real Soul Backup v2.4.1',
    tx: '0x6803...754f3',
    txUrl: txQueryUrl('0x68036b32d4b75d69fdbbcd5253bfcb4771c1c3960d8a18d48ed9803ad51754f3'),
    dataLink: 'data.arkiv.network/entity/0x1c1d...d8ce',
    dataUrl: `${DATA_ARKIV_BASE_URL}/entity/0x1c1d27c0f7afbddd09d039998e6747b7ec1cbdc9a25073e83a816a55ae18d8ce`,
    time: 'May 26, 2026',
  },
  {
    type: 'agentImprovementProof',
    typeColor: 'text-[#f97316]',
    icon: Trophy,
    iconColor: 'text-[#f97316]',
    agent: 'Valvrave',
    entity: 'Competition readiness proofs',
    tx: 'query',
    txUrl: proofQueryUrl('agentImprovementProof'),
    dataLink: 'data.arkiv.network/?query=agentImprovementProof',
    dataUrl: proofQueryUrl('agentImprovementProof'),
    time: 'Live query',
  },
]
