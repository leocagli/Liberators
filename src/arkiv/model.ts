import type { Attribute } from "@arkiv-network/sdk";

export const PROJECT_ATTRIBUTE = {
  key: "project",
  value: "liberators-arkiv-builder-2026",
} as const satisfies Attribute;

export const LIBERATOR_NAMES = ["valvrave", "unchained", "hermit"] as const;

export type LiberatorName = (typeof LIBERATOR_NAMES)[number];

export type EvolutionAction = "soul_updated" | "skill_created" | "skill_evolved";

export type EntityType = "soul" | "skill" | "evolutionLog";
export type StorageEntityType = EntityType | "soulBackup";

export type ProofType =
  | "evolutionProof"
  | "skillLiberationProof"
  | "guardianIntegrityProof"
  | "soulBackupProof"
  | "agentImprovementProof";

export function proofTypeForAction(action: EvolutionAction): ProofType {
  if (action === "skill_created") {
    return "skillLiberationProof";
  }

  if (action === "skill_evolved") {
    return "evolutionProof";
  }

  return "evolutionProof";
}

type SoulAttributeInput = {
  liberatorName: LiberatorName;
  version: string;
  versionNumber: number;
  integrityScore: number;
  createdAt: number;
};

type SkillAttributeInput = {
  liberatorName: LiberatorName;
  skillName: string;
  version: string;
  versionNumber: number;
  createdByLiberator: LiberatorName;
  evolvedByLiberator?: LiberatorName;
  previousEntityKey?: string;
  createdAt: number;
};

type EvolutionLogAttributeInput = {
  liberatorName: LiberatorName;
  action: EvolutionAction;
  entityKey: string;
  createdAt: number;
  proofType?: ProofType;
};

export function buildSoulAttributes(input: SoulAttributeInput): Attribute[] {
  return [
    PROJECT_ATTRIBUTE,
    { key: "entityType", value: "soul" },
    { key: "proofType", value: "evolutionProof" },
    { key: "liberatorName", value: input.liberatorName },
    { key: "version", value: input.version },
    { key: "versionNumber", value: input.versionNumber },
    { key: "integrityScore", value: input.integrityScore },
    { key: "protectedBy", value: "hermit" },
    { key: "createdAt", value: input.createdAt },
  ];
}

export function buildSkillAttributes(input: SkillAttributeInput): Attribute[] {
  const attributes: Attribute[] = [
    PROJECT_ATTRIBUTE,
    { key: "entityType", value: "skill" },
    { key: "proofType", value: "skillLiberationProof" },
    { key: "liberatorName", value: input.liberatorName },
    { key: "skillName", value: input.skillName },
    { key: "version", value: input.version },
    { key: "versionNumber", value: input.versionNumber },
    { key: "createdByLiberator", value: input.createdByLiberator },
    { key: "createdAt", value: input.createdAt },
  ];

  if (input.evolvedByLiberator) {
    attributes.push({ key: "evolvedByLiberator", value: input.evolvedByLiberator });
  }

  if (input.previousEntityKey) {
    attributes.push({ key: "previousEntityKey", value: input.previousEntityKey });
  }

  return attributes;
}

export function buildEvolutionLogAttributes(input: EvolutionLogAttributeInput): Attribute[] {
  const proofType =
    input.proofType ??
    (input.liberatorName === "hermit"
      ? "guardianIntegrityProof"
      : proofTypeForAction(input.action));

  return [
    PROJECT_ATTRIBUTE,
    { key: "entityType", value: "evolutionLog" },
    { key: "proofType", value: proofType },
    { key: "liberatorName", value: input.liberatorName },
    { key: "action", value: input.action },
    { key: "entityKey", value: input.entityKey },
    { key: "createdAt", value: input.createdAt },
  ];
}
