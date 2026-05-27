import { NextResponse } from 'next/server'
import { z } from 'zod'

import { createLiberatorsWalletClient } from '@/src/arkiv/client'
import { saveEvolutionToArkiv } from '@/src/skills/saveEvolutionToArkiv'

const SkillRequestSchema = z.object({
  liberatorName: z.literal('unchained'),
  action: z.enum(['create', 'improve']),
  skillName: z.string().min(1).max(120),
  version: z.string().min(1),
  previousEntityKey: z.string().min(1).optional(),
  context: z.string().min(1).max(2000),
})

export async function POST(request: Request) {
  try {
    const input = SkillRequestSchema.parse(await request.json())
    const timestamp = Date.now()
    const versionNumber = parseInt(input.version.replace(/[^\d]/g, ''), 10) || 1
    const skillVersion =
      input.action === 'create'
        ? `${input.version}-skill`
        : `${input.version}-skill+1`

    const result = await saveEvolutionToArkiv({
      walletClient: createLiberatorsWalletClient(),
      entry: {
        entityType: 'skill',
        payload: {
          liberatorName: input.liberatorName,
          skillName: input.skillName,
          version: skillVersion,
          versionNumber,
          content: input.context,
          createdByLiberator: 'unchained',
          evolvedByLiberator: input.action === 'improve' ? 'valvrave' : undefined,
          previousEntityKey: input.previousEntityKey,
          createdAt: timestamp,
        },
      },
      action: input.action === 'create' ? 'skill_created' : 'skill_evolved',
      description:
        input.action === 'create'
          ? `Skill ${input.skillName} created by Unchained. ${input.context}`
          : `Skill ${input.skillName} improved for the Liberators runtime. ${input.context}`,
      timestamp,
    })

    return NextResponse.json({
      ok: true,
      proofType: input.action === 'create' ? 'skillLiberationProof' : 'evolutionProof',
      action: input.action,
      skillName: input.skillName,
      ...result,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unable to write skill proof.' },
      { status: 500 },
    )
  }
}
