import { describe, expect, it, vi } from "vitest";

import {
  buildArkivGateInteraction,
  persistLiberatorEvolutionViaArkivGate,
} from "../src/arkivgate/client";

describe("ArkivGate client", () => {
  it("maps a Liberators evolution event to the ArkivGate bridge contract", () => {
    const body = buildArkivGateInteraction({
      liberatorName: "valvrave",
      action: "soul_updated",
      description: "Valvrave initialized its soul.",
      content: "Valvrave soul v1",
      timestamp: 1_779_753_600_000,
      version: "1.0.0",
      proofType: "evolutionProof",
    });

    expect(body).toEqual({
      orgId: "liberators",
      traceId: "liberators-valvrave-soul_updated-1779753600000",
      action: "LOG",
      severity: "low",
      reason: "Valvrave initialized its soul.",
      promptRedacted: "Valvrave soul v1",
      model: "liberators-agent-family",
      matchedRules: [],
      riskScore: 0,
      latencyMs: 0,
      agentKey: "liberator_valvrave",
      sessionKey: "liberators-valvrave",
      createdAt: 1_779_753_600_000,
      policyKeyHint: "liberators-evolution",
      policySlugHint: "liberators-evolution",
      userId: "evolutionProof",
      agentPaymentRail: "none",
      policyHits: [
        {
          layer: "pattern",
          policy_id: "liberators-evolution",
          slug: "liberators-evolution",
          action: "LOG",
        },
      ],
    });
  });

  it("posts to ArkivGate using the bridge token and returns Arkiv refs", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () =>
        JSON.stringify({
          ok: true,
          traceId: "trace",
          arkiv: { policyDecisionKey: "0xdecision" },
          arkivError: null,
        }),
    });

    const result = await persistLiberatorEvolutionViaArkivGate({
      bridgeUrl: "https://arkivgate.example/api/internal/arkiv/interactions",
      bridgeToken: "secret",
      fetchImpl,
      event: {
        liberatorName: "hermit",
        action: "skill_evolved",
        description: "Hermit verified skill integrity.",
        content: "integrity report",
        timestamp: 1_779_753_600_000,
      },
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://arkivgate.example/api/internal/arkiv/interactions",
      expect.objectContaining({
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-arkiv-bridge-token": "secret",
        },
      }),
    );
    expect(result.arkiv).toEqual({ policyDecisionKey: "0xdecision" });
  });
});
