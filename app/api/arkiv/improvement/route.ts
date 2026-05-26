import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createLiberatorsWalletClient } from '@/src/arkiv/client'
import { buildCreateEntityInput, buildEvolutionLogInput } from '@/src/arkiv/memory'
import { entityExplorerUrl, transactionExplorerUrl } from '@/src/arkiv/explorer'
import { LiberatorNameSchema } from '@/src/arkiv/schemas'

const ImprovementRequestSchema = z.object({
  liberatorName: LiberatorNameSchema,
  version: z.string().min(1),
  integrityScore: z.number().min(0).max(100),
  competitionContext: z.string().min(1).max(2000).default('Agent submission readiness checkpoint'),
})

export async function POST(request: Request) {
  try {
    const input = ImprovementRequestSchema.parse(await request.json())
    const walletClient = createLiberatorsWalletClient()
    const timestamp = Date.now()
    const versionNumber = parseInt(input.version.replace(/[^\d]/g, ''), 10) || 1

    const entity = await walletClient.createEntity(
      buildCreateEntityInput({
        entityType: 'soul',
        payload: {
          liberatorName: input.liberatorName,
          version: input.version,
          versionNumber,
          content: `Agent improvement proof: ${input.competitionContext}. This checkpoint tracks progress toward agent submission quality.`,
          integrityScore: Math.round(input.integrityScore),
          protectedBy: 'hermit',
          createdAt: timestamp,
        },
      }),
    )

    const proof = await walletClient.createEntity(
      buildEvolutionLogInput({
        liberatorName: input.liberatorName,
        action: 'soul_updated',
        description: `Agent improvement proof recorded for ${input.liberatorName}: ${input.competitionContext}.`,
        timestamp,
        txHash: entity.txHash,
        entityKey: entity.entityKey,
        proofType: 'agentImprovementProof',
      }),
    )

    return NextResponse.json({
      ok: true,
      proofType: 'agentImprovementProof',
      entityKey: entity.entityKey,
      txHash: entity.txHash,
      entityExplorerUrl: entityExplorerUrl(entity.entityKey),
      txExplorerUrl: transactionExplorerUrl(entity.txHash),
      proofEntityKey: proof.entityKey,
      proofTxHash: proof.txHash,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unable to write improvement proof.' },
      { status: 500 },
    )
  }
}
