import { jsonToPayload } from "@arkiv-network/sdk";
import { eq } from "@arkiv-network/sdk/query";
import { ExpirationTime } from "@arkiv-network/sdk/utils";

import {
  buildEvolutionLogAttributes,
  buildSkillAttributes,
  buildSoulAttributes,
  type EntityType,
  type EvolutionAction,
  type LiberatorName,
  PROJECT_ATTRIBUTE,
  proofTypeForAction,
} from "./model";
import {
  EvolutionLogSchema,
  SkillEntrySchema,
  SoulEntrySchema,
  type EvolutionLog,
  type SkillEntry,
  type SoulEntry,
} from "./schemas";

export const LIBERATORS_CONTENT_TYPE = "application/json";

export const LIBERATORS_TTL = {
  soul: ExpirationTime.fromDays(30),
  skill: ExpirationTime.fromDays(30),
  evolutionLog: ExpirationTime.fromDays(30),
} as const satisfies Record<EntityType, number>;

export type ArkivCreateEntityClient = {
  createEntity: (data: {
    payload: Uint8Array;
    contentType: string;
    attributes: { key: string; value: string | number }[];
    expiresIn: number;
  }) => Promise<{ entityKey: string; txHash: string }>;
};

export type ArkivExtendEntityClient = {
  extendEntity: (data: { entityKey: string; expiresIn: number }) => Promise<{
    entityKey: string;
    txHash: string;
  }>;
};

type QueryBuilderLike = {
  where: (predicate: unknown) => QueryBuilderLike;
  createdBy: (wallet: string) => QueryBuilderLike;
  withPayload: (include: boolean) => QueryBuilderLike;
  withAttributes: (include: boolean) => QueryBuilderLike;
  withMetadata: (include: boolean) => QueryBuilderLike;
  limit: (limit: number) => QueryBuilderLike;
  fetch: () => Promise<unknown>;
};

export type ArkivQueryClient = {
  buildQuery: () => QueryBuilderLike;
};

export type LiberatorEntry =
  | { entityType: "soul"; payload: SoulEntry }
  | { entityType: "skill"; payload: SkillEntry };

export function buildCreateEntityInput(entry: LiberatorEntry) {
  if (entry.entityType === "soul") {
    const payload = SoulEntrySchema.parse(entry.payload);

    return {
      payload: jsonToPayload(payload),
      contentType: LIBERATORS_CONTENT_TYPE,
      attributes: buildSoulAttributes(payload),
      expiresIn: LIBERATORS_TTL.soul,
    };
  }

  const payload = SkillEntrySchema.parse(entry.payload);

  return {
    payload: jsonToPayload(payload),
    contentType: LIBERATORS_CONTENT_TYPE,
    attributes: buildSkillAttributes(payload),
    expiresIn: LIBERATORS_TTL.skill,
  };
}

export function buildEvolutionLogInput(log: EvolutionLog) {
  const payload = EvolutionLogSchema.parse(log);

  return {
    payload: jsonToPayload(payload),
    contentType: LIBERATORS_CONTENT_TYPE,
    attributes: buildEvolutionLogAttributes({
      liberatorName: payload.liberatorName,
      action: payload.action,
      entityKey: payload.entityKey,
      createdAt: payload.timestamp,
      proofType: payload.proofType ?? proofTypeForAction(payload.action),
    }),
    expiresIn: LIBERATORS_TTL.evolutionLog,
  };
}

export function actionMatchesEntry(action: EvolutionAction, entryType: LiberatorEntry["entityType"]) {
  if (action === "soul_updated") {
    return entryType === "soul";
  }

  return entryType === "skill";
}

export async function queryLiberatorMemory(input: {
  publicClient: ArkivQueryClient;
  entityType: EntityType;
  liberatorName?: LiberatorName;
  trustedCreatorWallet?: string;
  limit?: number;
}) {
  const predicates = [
    eq(PROJECT_ATTRIBUTE.key, PROJECT_ATTRIBUTE.value),
    eq("entityType", input.entityType),
  ];

  if (input.liberatorName) {
    predicates.push(eq("liberatorName", input.liberatorName));
  }

  let query = input.publicClient
    .buildQuery()
    .where(predicates)
    .withPayload(true)
    .withAttributes(true)
    .withMetadata(true)
    .limit(input.limit ?? 50);

  if (input.trustedCreatorWallet) {
    query = query.createdBy(input.trustedCreatorWallet);
  }

  return query.fetch();
}

export async function extendLiberatorMemory(input: {
  walletClient: ArkivExtendEntityClient;
  entityKey: string;
  entityType: EntityType;
}) {
  return input.walletClient.extendEntity({
    entityKey: input.entityKey,
    expiresIn: LIBERATORS_TTL[input.entityType],
  });
}
