import { NextResponse } from 'next/server'

import { createLiberatorsPublicClient } from '@/src/arkiv/client'
import { queryLiberatorMemory } from '@/src/arkiv/memory'
import { getConfiguredArkivAccount } from '@/src/arkiv/wallet'
import { EvolutionLogSchema, type EvolutionLog } from '@/src/arkiv/schemas'

type QueryEntity = { toJson: () => unknown }

function formatAgentName(value: EvolutionLog['liberatorName']) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function deriveEntityLabel(log: EvolutionLog) {
  if (log.proofType === 'soulBackupProof') {
    return `${formatAgentName(log.liberatorName)} soul backup`
  }

  if (log.proofType === 'agentImprovementProof') {
    return `${formatAgentName(log.liberatorName)} autonomous evolution`
  }

  if (log.proofType === 'guardianIntegrityProof') {
    return `${formatAgentName(log.liberatorName)} guardian integrity`
  }

  const skillMatch = /Skill\s+(.+?)\s+(created|improved)/i.exec(log.description)
  if (skillMatch?.[1]) {
    return skillMatch[2]?.toLowerCase() === 'created'
      ? skillMatch[1]
      : `${skillMatch[1]} improved`
  }

  if (log.description.toLowerCase().includes('revival')) {
    return `${formatAgentName(log.liberatorName)} revived soul`
  }

  return `${formatAgentName(log.liberatorName)} proof`
}

function toProofEntity(log: EvolutionLog) {
  return {
    type: log.proofType ?? 'evolutionProof',
    agent: formatAgentName(log.liberatorName),
    entity: deriveEntityLabel(log),
    txHash: log.txHash,
    entityKey: log.entityKey,
    timestamp: log.timestamp,
  }
}

export async function GET() {
  try {
    const account = getConfiguredArkivAccount()
    const result = await queryLiberatorMemory({
      publicClient: createLiberatorsPublicClient() as never,
      entityType: 'evolutionLog',
      trustedCreatorWallet: account.address,
      limit: 100,
    }) as { entities?: QueryEntity[] }

    const records = (result.entities ?? [])
      .map((entity) => EvolutionLogSchema.safeParse(entity.toJson()))
      .filter((parsed): parsed is { success: true; data: EvolutionLog } => parsed.success)
      .map((parsed) => parsed.data)
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(toProofEntity)

    return NextResponse.json({
      ok: true,
      count: records.length,
      records,
      signer: account.address,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unable to load proof history.' },
      { status: 500 },
    )
  }
}
