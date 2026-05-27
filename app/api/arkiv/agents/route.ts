import { NextResponse } from 'next/server'

import { createLiberatorsPublicClient } from '@/src/arkiv/client'
import { queryLiberatorMemory } from '@/src/arkiv/memory'
import { LIBERATOR_NAMES, type LiberatorName } from '@/src/arkiv/model'
import { querySoulBackups } from '@/src/arkiv/soul-backup'
import {
  EvolutionLogSchema,
  SkillEntrySchema,
  SoulEntrySchema,
  type EvolutionLog,
  type SkillEntry,
  type SoulBackup,
  type SoulEntry,
} from '@/src/arkiv/schemas'

type QueryEntity = { toJson: () => unknown }

type AgentSnapshot = {
  id: LiberatorName
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

const AGENT_VISUALS: Record<LiberatorName, Pick<AgentSnapshot, 'status' | 'statusColor' | 'dotColor' | 'avatar' | 'arkivGate'>> = {
  valvrave: {
    status: 'ACTIVE',
    statusColor: 'text-[#00e87a]',
    dotColor: 'bg-[#00e87a]',
    avatar: '/valvrave.jpg',
    arkivGate: 'braga.arkiv.network',
  },
  unchained: {
    status: 'IDLE',
    statusColor: 'text-[#4e7050]',
    dotColor: 'bg-[#4e7050]',
    avatar: '/unchained.jpg',
    arkivGate: 'braga.arkiv.network',
  },
  hermit: {
    status: 'GUARDIAN',
    statusColor: 'text-[#38bdf8]',
    dotColor: 'bg-[#38bdf8]',
    avatar: '/hermit.jpg',
    arkivGate: 'braga.arkiv.network',
  },
}

function formatAgentName(value: LiberatorName) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function formatTimestamp(timestamp?: number) {
  return timestamp ? new Date(timestamp).toUTCString().replace('GMT', 'UTC') : 'No backup recorded'
}

function compactHash(value?: string) {
  if (!value) return 'Unavailable'
  return `${value.slice(0, 8)}...${value.slice(-6)}`
}

function parseEntities<T>(entities: QueryEntity[] | undefined, schema: { safeParse: (value: unknown) => { success: true; data: T } | { success: false } }) {
  return (entities ?? [])
    .map((entity) => schema.safeParse(entity.toJson()))
    .filter((parsed): parsed is { success: true; data: T } => parsed.success)
    .map((parsed) => parsed.data)
}

function latestByCreatedAt<T extends { createdAt: number }>(entries: T[]) {
  return [...entries].sort((a, b) => b.createdAt - a.createdAt)[0]
}

function latestByTimestamp<T extends { timestamp: number }>(entries: T[]) {
  return [...entries].sort((a, b) => b.timestamp - a.timestamp)[0]
}

function latestSoulLog(logs: EvolutionLog[]) {
  return latestByTimestamp(
    logs.filter((log) => log.action === 'soul_updated' || log.proofType === 'soulBackupProof' || log.proofType === 'agentImprovementProof'),
  )
}

export async function GET() {
  try {
    const publicClient = createLiberatorsPublicClient()

    const snapshots = await Promise.all(
      LIBERATOR_NAMES.map(async (liberatorName) => {
        const [soulResult, skillResult, logResult, backups] = await Promise.all([
          queryLiberatorMemory({
            publicClient: publicClient as never,
            entityType: 'soul',
            liberatorName,
            limit: 20,
          }) as Promise<{ entities?: QueryEntity[] }>,
          queryLiberatorMemory({
            publicClient: publicClient as never,
            entityType: 'skill',
            liberatorName,
            limit: 20,
          }) as Promise<{ entities?: QueryEntity[] }>,
          queryLiberatorMemory({
            publicClient: publicClient as never,
            entityType: 'evolutionLog',
            liberatorName,
            limit: 50,
          }) as Promise<{ entities?: QueryEntity[] }>,
          querySoulBackups({
            publicClient: publicClient as never,
            liberatorName,
            limit: 20,
          }),
        ])

        const souls = parseEntities<SoulEntry>(soulResult.entities, SoulEntrySchema)
        const skills = parseEntities<SkillEntry>(skillResult.entities, SkillEntrySchema)
        const logs = parseEntities<EvolutionLog>(logResult.entities, EvolutionLogSchema)

        const latestSoul = latestByCreatedAt(souls)
        const latestSkill = latestByCreatedAt(skills)
        const latestBackup = latestByCreatedAt<SoulBackup>(backups)
        const latestLog = latestSoulLog(logs)

        const base = AGENT_VISUALS[liberatorName]
        const version = latestSoul?.version ?? latestSkill?.version ?? 'v1.0.0'
        const integrityScore = latestSoul?.integrityScore ?? latestBackup?.integrityScore ?? (liberatorName === 'hermit' ? 100 : 72)
        const protectedBy =
          latestSoul?.protectedBy === 'hermit' || latestBackup?.protectedBy === 'hermit'
            ? 'Hermit'
            : liberatorName === 'hermit'
              ? 'Self'
              : 'None'

        const snapshot: AgentSnapshot = {
          id: liberatorName,
          name: formatAgentName(liberatorName),
          ...base,
          version,
          integrityScore,
          protectedBy,
          lastBackup: formatTimestamp(latestBackup?.createdAt),
          block: latestLog ? `Proof ${compactHash(latestLog.txHash)}` : 'No Arkiv proof yet',
          soulId: latestLog?.entityKey ? compactHash(latestLog.entityKey) : 'Unavailable',
        }

        return snapshot
      }),
    )

    return NextResponse.json({
      ok: true,
      agents: snapshots,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unable to load agent snapshots.' },
      { status: 500 },
    )
  }
}
