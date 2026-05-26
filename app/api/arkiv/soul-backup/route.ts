import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createLiberatorsWalletClient } from '@/src/arkiv/client'
import { buildEvolutionLogInput } from '@/src/arkiv/memory'
import { saveSoulBackupToArkiv } from '@/src/arkiv/soul-backup'
import { LiberatorNameSchema } from '@/src/arkiv/schemas'

const BackupRequestSchema = z.object({
  liberatorName: LiberatorNameSchema,
  version: z.string().min(1),
  integrityScore: z.number().min(0).max(100),
  content: z.string().min(1).max(20_000).optional(),
})

export async function POST(request: Request) {
  try {
    const input = BackupRequestSchema.parse(await request.json())
    const walletClient = createLiberatorsWalletClient()
    const createdAt = Date.now()
    const versionNumber = parseInt(input.version.replace(/[^\d]/g, ''), 10) || 1

    const backup = await saveSoulBackupToArkiv({
      walletClient,
      backup: {
        liberatorName: input.liberatorName,
        version: input.version,
        versionNumber,
        content:
          input.content ??
          `${input.liberatorName} soul backup: decentralized recovery state for revival from Arkiv Braga.`,
        integrityScore: Math.round(input.integrityScore),
        protectedBy: 'hermit',
        backupReason: 'manual_checkpoint',
        createdAt,
      },
    })

    const proof = await walletClient.createEntity(
      buildEvolutionLogInput({
        liberatorName: input.liberatorName,
        action: 'soul_updated',
        description: `Soul backup checkpoint recorded for ${input.liberatorName}. If the agent dies, it can revive from this decentralized soulBackup.`,
        timestamp: createdAt,
        txHash: backup.txHash,
        entityKey: backup.entityKey,
        proofType: 'soulBackupProof',
      }),
    )

    return NextResponse.json({
      ok: true,
      proofType: 'soulBackupProof',
      ...backup,
      proofEntityKey: proof.entityKey,
      proofTxHash: proof.txHash,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unable to write soul backup.' },
      { status: 500 },
    )
  }
}
