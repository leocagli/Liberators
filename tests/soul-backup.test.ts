import { describe, expect, it, vi } from "vitest";

import {
  buildSoulBackupAttributes,
  buildSoulBackupEntityInput,
  restoreSoulFromBackup,
  saveSoulBackupToArkiv,
} from "../src/arkiv/soul-backup";

describe("Soul backup", () => {
  it("builds queryable Arkiv attributes for decentralized soul backups", () => {
    const attributes = buildSoulBackupAttributes({
      liberatorName: "valvrave",
      version: "1.0.0",
      versionNumber: 1,
      integrityScore: 99,
      backupReason: "pre_evolution_checkpoint",
      createdAt: 1_779_753_600_000,
    });

    expect(attributes).toContainEqual({
      key: "project",
      value: "liberators-arkiv-builder-2026",
    });
    expect(attributes).toContainEqual({ key: "entityType", value: "soulBackup" });
    expect(attributes).toContainEqual({ key: "proofType", value: "soulBackupProof" });
    expect(attributes).toContainEqual({ key: "liberatorName", value: "valvrave" });
    expect(attributes).toContainEqual({ key: "backupReason", value: "pre_evolution_checkpoint" });
    expect(attributes).toContainEqual({ key: "createdAt", value: 1_779_753_600_000 });
  });

  it("creates a SoulBackup Arkiv entity and returns data.arkiv links", async () => {
    const createEntity = vi.fn().mockResolvedValue({
      entityKey: "0xbackup",
      txHash: "0xtx",
    });

    const result = await saveSoulBackupToArkiv({
      walletClient: { createEntity },
      backup: {
        liberatorName: "valvrave",
        version: "1.0.0",
        versionNumber: 1,
        content: "Valvrave soul backup",
        integrityScore: 99,
        protectedBy: "hermit",
        backupReason: "pre_evolution_checkpoint",
        createdAt: 1_779_753_600_000,
      },
    });

    expect(createEntity).toHaveBeenCalledWith(
      expect.objectContaining({
        contentType: "application/json",
        attributes: expect.arrayContaining([
          { key: "entityType", value: "soulBackup" },
          { key: "proofType", value: "soulBackupProof" },
        ]),
      }),
    );
    expect(result).toEqual({
      entityKey: "0xbackup",
      txHash: "0xtx",
      entityExplorerUrl: "https://data.arkiv.network/entity/0xbackup",
      txExplorerUrl: "https://data.arkiv.network/?query=0xtx",
    });
  });

  it("restores the newest valid soul backup from Arkiv query results", async () => {
    const backup = {
      liberatorName: "unchained",
      version: "2.0.0",
      versionNumber: 2,
      content: "Unchained restored soul",
      integrityScore: 94,
      protectedBy: "hermit",
      backupReason: "manual_checkpoint",
      createdAt: 1_779_753_700_000,
    };
    const older = { ...backup, version: "1.0.0", versionNumber: 1, createdAt: 1 };
    const fetch = vi.fn().mockResolvedValue({
      entities: [
        { toJson: () => older },
        { toJson: () => backup },
      ],
    });
    const queryBuilder = {
      where: vi.fn().mockReturnThis(),
      withPayload: vi.fn().mockReturnThis(),
      withAttributes: vi.fn().mockReturnThis(),
      withMetadata: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      fetch,
    };

    const restored = await restoreSoulFromBackup({
      publicClient: { buildQuery: vi.fn(() => queryBuilder) },
      liberatorName: "unchained",
    });

    expect(restored).toEqual(backup);
    expect(queryBuilder.where).toHaveBeenCalled();
    expect(queryBuilder.limit).toHaveBeenCalledWith(20);
  });
});
