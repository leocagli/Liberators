import { describe, expect, it, vi } from "vitest";

import { saveEvolutionToArkiv } from "../src/skills/saveEvolutionToArkiv";

describe("saveEvolutionToArkiv", () => {
  it("creates the changed entity and then writes an evolution log", async () => {
    const createEntity = vi
      .fn()
      .mockResolvedValueOnce({ entityKey: "0xsoul", txHash: "0xtx-soul" })
      .mockResolvedValueOnce({ entityKey: "0xlog", txHash: "0xtx-log" });

    const result = await saveEvolutionToArkiv({
      walletClient: { createEntity },
      entry: {
        entityType: "soul",
        payload: {
          liberatorName: "valvrave",
          version: "1.0.0",
          versionNumber: 1,
          content: "Valvrave v1 soul.",
          integrityScore: 97,
          protectedBy: "hermit",
          createdAt: 1_779_753_600_000,
        },
      },
      action: "soul_updated",
      description: "Valvrave initialized its first soul version.",
      timestamp: 1_779_753_600_000,
    });

    expect(createEntity).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      entityKey: "0xsoul",
      txHash: "0xtx-soul",
      entityExplorerUrl: "https://data.arkiv.network/entity/0xsoul",
      txExplorerUrl: "https://data.arkiv.network/?query=0xtx-soul",
      logEntityKey: "0xlog",
      logTxHash: "0xtx-log",
      logEntityExplorerUrl: "https://data.arkiv.network/entity/0xlog",
      logTxExplorerUrl: "https://data.arkiv.network/?query=0xtx-log",
    });

    expect(createEntity.mock.calls[0]?.[0].attributes).toContainEqual({
      key: "entityType",
      value: "soul",
    });
    expect(createEntity.mock.calls[1]?.[0].attributes).toContainEqual({
      key: "entityType",
      value: "evolutionLog",
    });
    expect(createEntity.mock.calls[1]?.[0].attributes).toContainEqual({
      key: "entityKey",
      value: "0xsoul",
    });
  });
});
