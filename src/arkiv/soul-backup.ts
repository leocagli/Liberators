import { jsonToPayload } from "@arkiv-network/sdk";
import type { Attribute } from "@arkiv-network/sdk";
import { eq } from "@arkiv-network/sdk/query";
import { ExpirationTime } from "@arkiv-network/sdk/utils";

import { entityExplorerUrl, transactionExplorerUrl } from "./explorer";
import {
  PROJECT_ATTRIBUTE,
  type LiberatorName,
} from "./model";
import {
  SoulBackupSchema,
  type SoulBackup,
} from "./schemas";

export const SOUL_BACKUP_TTL = ExpirationTime.fromDays(30);

export type SoulBackupReason = SoulBackup["backupReason"];

export type SoulBackupCreateClient = {
  createEntity: (data: {
    payload: Uint8Array;
    contentType: string;
    attributes: Attribute[];
    expiresIn: number;
  }) => Promise<{ entityKey: string; txHash: string }>;
};

type SoulBackupQueryBuilder = {
  where: (predicate: any) => SoulBackupQueryBuilder;
  withPayload: (include: boolean) => SoulBackupQueryBuilder;
  withAttributes: (include: boolean) => SoulBackupQueryBuilder;
  withMetadata: (include: boolean) => SoulBackupQueryBuilder;
  limit: (limit: number) => SoulBackupQueryBuilder;
  fetch: () => Promise<{ entities: Array<{ toJson: () => unknown }> }>;
};

export type SoulBackupPublicClient = {
  buildQuery: () => SoulBackupQueryBuilder;
};

export type SoulBackupReadClient = SoulBackupPublicClient & {
  getEntity: (entityKey: `0x${string}`) => Promise<{ toJson: () => unknown } | null>;
};

export function buildSoulBackupAttributes(input: {
  liberatorName: LiberatorName;
  version: string;
  versionNumber: number;
  integrityScore: number;
  backupReason: SoulBackupReason;
  createdAt: number;
}): Attribute[] {
  return [
    PROJECT_ATTRIBUTE,
    { key: "entityType", value: "soulBackup" },
    { key: "proofType", value: "soulBackupProof" },
    { key: "liberatorName", value: input.liberatorName },
    { key: "version", value: input.version },
    { key: "versionNumber", value: input.versionNumber },
    { key: "integrityScore", value: input.integrityScore },
    { key: "protectedBy", value: "hermit" },
    { key: "backupReason", value: input.backupReason },
    { key: "createdAt", value: input.createdAt },
  ];
}

export function buildSoulBackupEntityInput(backup: SoulBackup) {
  const payload = SoulBackupSchema.parse(backup);

  return {
    payload: jsonToPayload(payload),
    contentType: "application/json",
    attributes: buildSoulBackupAttributes(payload),
    expiresIn: SOUL_BACKUP_TTL,
  };
}

export async function saveSoulBackupToArkiv(input: {
  walletClient: SoulBackupCreateClient;
  backup: SoulBackup;
}) {
  const result = await input.walletClient.createEntity(
    buildSoulBackupEntityInput(input.backup),
  );

  return {
    entityKey: result.entityKey,
    txHash: result.txHash,
    entityExplorerUrl: entityExplorerUrl(result.entityKey),
    txExplorerUrl: transactionExplorerUrl(result.txHash),
  };
}

export async function restoreSoulFromBackup(input: {
  publicClient: SoulBackupPublicClient;
  liberatorName: LiberatorName;
  limit?: number;
}): Promise<SoulBackup | null> {
  const backups = await querySoulBackups(input);
  return backups[0] ?? null;
}

export async function querySoulBackups(input: {
  publicClient: SoulBackupPublicClient;
  liberatorName: LiberatorName;
  limit?: number;
}): Promise<SoulBackup[]> {
  const result = await input.publicClient
    .buildQuery()
    .where([
      eq(PROJECT_ATTRIBUTE.key, PROJECT_ATTRIBUTE.value),
      eq("entityType", "soulBackup"),
      eq("proofType", "soulBackupProof"),
      eq("liberatorName", input.liberatorName),
    ])
    .withPayload(true)
    .withAttributes(true)
    .withMetadata(true)
    .limit(input.limit ?? 20)
    .fetch();

  return result.entities
    .map((entity) => SoulBackupSchema.safeParse(entity.toJson()))
    .filter((parsed): parsed is { success: true; data: SoulBackup } => parsed.success)
    .map((parsed) => parsed.data)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getSoulBackupByEntityKey(input: {
  publicClient: SoulBackupReadClient;
  entityKey: `0x${string}`;
}): Promise<SoulBackup | null> {
  const entity = await input.publicClient.getEntity(input.entityKey);

  if (!entity) {
    return null;
  }

  const parsed = SoulBackupSchema.safeParse(entity.toJson());
  return parsed.success ? parsed.data : null;
}
