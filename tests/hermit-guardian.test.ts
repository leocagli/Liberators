import { describe, expect, it, vi } from "vitest";

import {
  buildHermitIntegrityEvent,
  verifySoulWithHermit,
} from "../src/liberators/hermit";

describe("Hermit Soul Guardian", () => {
  it("builds an ArkivGate event for a protected soul verification", () => {
    const event = buildHermitIntegrityEvent({
      liberatorName: "valvrave",
      entityType: "soul",
      entityKey: "0xsoul",
      integrityScore: 92,
      content: "Valvrave soul v1",
      timestamp: 1_779_753_600_000,
    });

    expect(event).toEqual({
      liberatorName: "hermit",
      action: "soul_updated",
      description:
        "Hermit verified valvrave soul integrity at 92/100 for entity 0xsoul.",
      content:
        "Guardian report: valvrave soul entity 0xsoul integrity=92. Valvrave soul v1",
      timestamp: 1_779_753_600_000,
      version: "guardian-1",
      proofType: "guardianIntegrityProof",
    });
  });

  it("routes Hermit's verification through ArkivGate when configured", async () => {
    const persistViaArkivGate = vi.fn().mockResolvedValue({
      ok: true,
      traceId: "trace",
      arkiv: { policyDecisionKey: "0xdecision" },
      arkivError: null,
    });

    const result = await verifySoulWithHermit({
      persistViaArkivGate,
      bridgeUrl: "https://arkivgate.example/api/internal/arkiv/interactions",
      bridgeToken: "secret",
      verification: {
        liberatorName: "unchained",
        entityType: "skill",
        entityKey: "0xskill",
        integrityScore: 88,
        content: "skill yaml",
        timestamp: 1_779_753_600_000,
      },
    });

    expect(persistViaArkivGate).toHaveBeenCalledWith({
      bridgeUrl: "https://arkivgate.example/api/internal/arkiv/interactions",
      bridgeToken: "secret",
      event: {
        liberatorName: "hermit",
        action: "skill_evolved",
        description:
          "Hermit verified unchained skill integrity at 88/100 for entity 0xskill.",
        content:
          "Guardian report: unchained skill entity 0xskill integrity=88. skill yaml",
        timestamp: 1_779_753_600_000,
        version: "guardian-1",
        proofType: "guardianIntegrityProof",
      },
    });
    expect(result.arkiv).toEqual({ policyDecisionKey: "0xdecision" });
  });
});
