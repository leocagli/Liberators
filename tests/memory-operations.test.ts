import { describe, expect, it, vi } from "vitest";

import { LIBERATORS_TTL, extendLiberatorMemory, queryLiberatorMemory } from "../src/arkiv/memory";

describe("Arkiv memory operations", () => {
  it("queries memory by project, entity type, liberator, and trusted creator", async () => {
    const fetch = vi.fn().mockResolvedValue({ entities: [] });
    const queryBuilder = {
      where: vi.fn().mockReturnThis(),
      createdBy: vi.fn().mockReturnThis(),
      withPayload: vi.fn().mockReturnThis(),
      withAttributes: vi.fn().mockReturnThis(),
      withMetadata: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      fetch,
    };
    const publicClient = { buildQuery: vi.fn(() => queryBuilder) };

    const result = await queryLiberatorMemory({
      publicClient,
      entityType: "soul",
      liberatorName: "valvrave",
      trustedCreatorWallet: "0xtrusted",
      limit: 25,
    });

    expect(result).toEqual({ entities: [] });
    expect(publicClient.buildQuery).toHaveBeenCalledOnce();
    expect(queryBuilder.where).toHaveBeenCalledTimes(1);
    expect(queryBuilder.createdBy).toHaveBeenCalledWith("0xtrusted");
    expect(queryBuilder.withPayload).toHaveBeenCalledWith(true);
    expect(queryBuilder.withAttributes).toHaveBeenCalledWith(true);
    expect(queryBuilder.withMetadata).toHaveBeenCalledWith(true);
    expect(queryBuilder.limit).toHaveBeenCalledWith(25);
    expect(fetch).toHaveBeenCalledOnce();
  });

  it("extends memory with the TTL matching its entity type", async () => {
    const extendEntity = vi.fn().mockResolvedValue({ entityKey: "0xsoul", txHash: "0xtx" });

    const result = await extendLiberatorMemory({
      walletClient: { extendEntity },
      entityKey: "0xsoul",
      entityType: "soul",
    });

    expect(result).toEqual({ entityKey: "0xsoul", txHash: "0xtx" });
    expect(extendEntity).toHaveBeenCalledWith({
      entityKey: "0xsoul",
      expiresIn: LIBERATORS_TTL.soul,
    });
  });
});
