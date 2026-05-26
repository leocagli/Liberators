import { z } from "zod";

import { LIBERATOR_NAMES } from "./model";

export const LiberatorNameSchema = z.enum(LIBERATOR_NAMES);

export const EvolutionActionSchema = z.enum([
  "soul_updated",
  "skill_created",
  "skill_evolved",
]);

export const ProofTypeSchema = z.enum([
  "evolutionProof",
  "skillLiberationProof",
  "guardianIntegrityProof",
  "soulBackupProof",
  "agentImprovementProof",
]);

export const SoulEntrySchema = z.object({
  liberatorName: LiberatorNameSchema,
  version: z.string().min(1),
  versionNumber: z.number().int().positive(),
  content: z.string().min(1),
  integrityScore: z.number().int().min(0).max(100),
  protectedBy: z.literal("hermit"),
  createdAt: z.number().int().positive(),
});

export const SoulBackupSchema = SoulEntrySchema.extend({
  backupReason: z.enum([
    "manual_checkpoint",
    "pre_evolution_checkpoint",
    "guardian_recovery_checkpoint",
  ]),
});

export const SkillEntrySchema = z.object({
  liberatorName: LiberatorNameSchema,
  skillName: z.string().min(1),
  version: z.string().min(1),
  versionNumber: z.number().int().positive(),
  content: z.string().min(1),
  createdByLiberator: LiberatorNameSchema,
  evolvedByLiberator: LiberatorNameSchema.optional(),
  previousEntityKey: z.string().min(1).optional(),
  createdAt: z.number().int().positive(),
});

export const EvolutionLogSchema = z.object({
  liberatorName: LiberatorNameSchema,
  action: EvolutionActionSchema,
  description: z.string().min(1),
  timestamp: z.number().int().positive(),
  txHash: z.string().min(1),
  entityKey: z.string().min(1),
  proofType: ProofTypeSchema.optional(),
});

export type SoulEntry = z.infer<typeof SoulEntrySchema>;
export type SoulBackup = z.infer<typeof SoulBackupSchema>;
export type SkillEntry = z.infer<typeof SkillEntrySchema>;
export type EvolutionLog = z.infer<typeof EvolutionLogSchema>;
