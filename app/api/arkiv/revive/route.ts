import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createLiberatorsPublicClient, createLiberatorsWalletClient } from '@/src/arkiv/client'
import { restoreSoulFromBackup } from '@/src/arkiv/soul-backup'
import { LiberatorNameSchema } from '@/src/arkiv/schemas'
import { saveEvolutionToArkiv } from '@/src/skills/saveEvolutionToArkiv'

const ReviveRequestSchema = z.object({
  liberatorName: LiberatorNameSchema,
})

export async function POST(request: Request) {
  try {
    const input = ReviveRequestSchema.parse(await request.json())
    const backup = await restoreSoulFromBackup({
      publicClient: createLiberatorsPublicClient(),
      liberatorName: input.liberatorName,
    })

    if (!backup) {
      return NextResponse.json(
        { ok: false, error: `No decentralized soulBackup found for ${input.liberatorName}.` },
        { status: 404 },
      )
    }

    const timestamp = Date.now()
    const result = await saveEvolutionToArkiv({
      walletClient: createLiberatorsWalletClient(),
      entry: {
        entityType: 'soul',
        payload: {
          liberatorName: backup.liberatorName,
          version: backup.version,
          versionNumber: backup.versionNumber,
          content: `Revived from decentralized soulBackup created at ${new Date(backup.createdAt).toISOString()}. ${backup.content}`,
          integrityScore: backup.integrityScore,
          protectedBy: 'hermit',
          createdAt: timestamp,
        },
      },
      action: 'soul_updated',
      description: `Revival checkpoint: ${input.liberatorName} reconstructed from decentralized Arkiv soulBackup.`,
      timestamp,
    })

    return NextResponse.json({
      ok: true,
      proofType: 'evolutionProof',
      restoredFrom: backup,
      ...result,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unable to revive from Arkiv.' },
      { status: 500 },
    )
  }
}
