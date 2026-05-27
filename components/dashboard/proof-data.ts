'use client'

import { Database, Leaf, Shield, Trophy, Zap, type LucideIcon } from 'lucide-react'

const DATA_ARKIV_BASE_URL = 'https://data.arkiv.network'
const PROJECT = 'liberators-arkiv-builder-2026'

export type ProofRecordType =
  | 'evolutionProof'
  | 'skillLiberationProof'
  | 'guardianIntegrityProof'
  | 'soulBackupProof'
  | 'agentImprovementProof'

export type ProofRecord = {
  type: ProofRecordType
  typeColor: string
  icon: LucideIcon
  iconColor: string
  agent: string
  entity: string
  tx: string
  txUrl: string
  dataLink: string
  dataUrl: string
  time: string
}

export type ProofRecordSnapshot = Omit<ProofRecord, 'icon' | 'iconColor' | 'typeColor'>

type RecordVisual = {
  icon: LucideIcon
  iconColor: string
  typeColor: string
}

const VISUALS: Record<ProofRecordType, RecordVisual> = {
  evolutionProof: { icon: Leaf, iconColor: 'text-[#00f080]', typeColor: 'text-[#00f080]' },
  skillLiberationProof: { icon: Zap, iconColor: 'text-[#8b5cf6]', typeColor: 'text-[#8b5cf6]' },
  guardianIntegrityProof: { icon: Shield, iconColor: 'text-[#38bdf8]', typeColor: 'text-[#38bdf8]' },
  soulBackupProof: { icon: Database, iconColor: 'text-[#f59e0b]', typeColor: 'text-[#f59e0b]' },
  agentImprovementProof: { icon: Trophy, iconColor: 'text-[#f97316]', typeColor: 'text-[#f97316]' },
}

export function queryUrl(query: string) {
  return `${DATA_ARKIV_BASE_URL}/?query=${encodeURIComponent(query)}`
}

export function proofQueryUrl(proofType: ProofRecordType) {
  return queryUrl(`project = "${PROJECT}" && proofType = "${proofType}"`)
}

export function txQueryUrl(txHash: string) {
  return queryUrl(txHash)
}

export function entityUrl(entityKey: string) {
  return `${DATA_ARKIV_BASE_URL}/entity/${entityKey}`
}

function compactHash(hash: string, start = 6, end = 5) {
  if (hash.length <= start + end + 3) {
    return hash
  }

  return `${hash.slice(0, start)}...${hash.slice(-end)}`
}

function formatUtcTime(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function buildProofRecord(input: {
  type: ProofRecordType
  agent: string
  entity: string
  txHash: string
  entityKey: string
  timestamp?: number
}): ProofRecord {
  const visual = VISUALS[input.type]

  return {
    type: input.type,
    typeColor: visual.typeColor,
    icon: visual.icon,
    iconColor: visual.iconColor,
    agent: input.agent,
    entity: input.entity,
    tx: compactHash(input.txHash, 8, 6),
    txUrl: txQueryUrl(input.txHash),
    dataLink: `data.arkiv.network/entity/${compactHash(input.entityKey, 10, 6)}`,
    dataUrl: entityUrl(input.entityKey),
    time: input.timestamp ? `${formatUtcTime(input.timestamp)} UTC` : 'Just now',
  }
}

export function snapshotProofRecord(record: ProofRecord): ProofRecordSnapshot {
  return {
    type: record.type,
    agent: record.agent,
    entity: record.entity,
    tx: record.tx,
    txUrl: record.txUrl,
    dataLink: record.dataLink,
    dataUrl: record.dataUrl,
    time: record.time,
  }
}

export function hydrateProofRecord(record: ProofRecordSnapshot): ProofRecord {
  const visual = VISUALS[record.type]

  return {
    ...record,
    icon: visual.icon,
    iconColor: visual.iconColor,
    typeColor: visual.typeColor,
  }
}

export const initialProofRecords: ProofRecord[] = [
  buildProofRecord({
    type: 'soulBackupProof',
    agent: 'Valvrave',
    entity: 'Real Soul Backup v2.4.1',
    txHash: '0x68036b32d4b75d69fdbbcd5253bfcb4771c1c3960d8a18d48ed9803ad51754f3',
    entityKey: '0x1c1d27c0f7afbddd09d039998e6747b7ec1cbdc9a25073e83a816a55ae18d8ce',
    timestamp: Date.UTC(2026, 4, 26, 0, 0, 0),
  }),
  {
    ...buildProofRecord({
      type: 'skillLiberationProof',
      agent: 'Unchained',
      entity: 'Live skill proof query',
      txHash: 'skill-query',
      entityKey: 'skill-query',
    }),
    tx: 'query',
    txUrl: proofQueryUrl('skillLiberationProof'),
    dataLink: 'Open live skill proofs',
    dataUrl: proofQueryUrl('skillLiberationProof'),
    time: 'Live query',
  },
  {
    ...buildProofRecord({
      type: 'guardianIntegrityProof',
      agent: 'Hermit',
      entity: 'Live guardian proof query',
      txHash: 'guardian-query',
      entityKey: 'guardian-query',
    }),
    tx: 'query',
    txUrl: proofQueryUrl('guardianIntegrityProof'),
    dataLink: 'Open live guardian proofs',
    dataUrl: proofQueryUrl('guardianIntegrityProof'),
    time: 'Live query',
  },
]
