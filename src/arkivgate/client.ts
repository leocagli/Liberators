import type { EvolutionAction, LiberatorName, ProofType } from "../arkiv/model";

type ArkivGateAction = "BLOCK" | "REDACT" | "WARN" | "LOG";
type ArkivGateSeverity = "low" | "medium" | "high" | "critical";

type PolicyHitRecord = {
  layer: "regex" | "pattern" | "nl";
  policy_id: string;
  slug: string;
  action: ArkivGateAction;
};

export type ArkivGateInteraction = {
  orgId: string;
  traceId: string;
  userId?: string;
  action: ArkivGateAction;
  severity: ArkivGateSeverity;
  reason: string;
  promptRedacted: string;
  model: string;
  matchedRules: string[];
  riskScore: number;
  latencyMs: number;
  agentKey: string;
  sessionKey: string;
  createdAt: number;
  policyKeyHint: string;
  policySlugHint: string;
  agentPaymentRail: "x402-demo" | "none";
  policyHits: PolicyHitRecord[];
};

export type LiberatorArkivGateEvent = {
  liberatorName: LiberatorName;
  action: EvolutionAction;
  description: string;
  content: string;
  timestamp?: number;
  version?: string;
  proofType?: ProofType;
};

export type ArkivGateBridgeResponse = {
  ok: boolean;
  traceId: string;
  arkiv: unknown;
  arkivError: string | null;
};

type FetchLike = typeof fetch;

const LIBERATORS_POLICY_SLUG = "liberators-evolution";

export function buildArkivGateInteraction(event: LiberatorArkivGateEvent): ArkivGateInteraction {
  const createdAt = event.timestamp ?? Date.now();

  return {
    orgId: "liberators",
    traceId: `liberators-${event.liberatorName}-${event.action}-${createdAt}`,
    action: "LOG",
    ...(event.proofType ? { userId: event.proofType } : {}),
    severity: "low",
    reason: event.description,
    promptRedacted: event.content,
    model: "liberators-agent-family",
    matchedRules: [],
    riskScore: 0,
    latencyMs: 0,
    agentKey: `liberator_${event.liberatorName}`,
    sessionKey: `liberators-${event.liberatorName}`,
    createdAt,
    policyKeyHint: LIBERATORS_POLICY_SLUG,
    policySlugHint: LIBERATORS_POLICY_SLUG,
    agentPaymentRail: "none",
    policyHits: [
      {
        layer: "pattern",
        policy_id: LIBERATORS_POLICY_SLUG,
        slug: LIBERATORS_POLICY_SLUG,
        action: "LOG",
      },
    ],
  };
}

export async function persistLiberatorEvolutionViaArkivGate(input: {
  bridgeUrl: string;
  bridgeToken: string;
  event: LiberatorArkivGateEvent;
  fetchImpl?: FetchLike;
}): Promise<ArkivGateBridgeResponse> {
  const fetcher = input.fetchImpl ?? fetch;
  const response = await fetcher(input.bridgeUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-arkiv-bridge-token": input.bridgeToken,
    },
    body: JSON.stringify(buildArkivGateInteraction(input.event)),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`ArkivGate bridge failed with ${response.status}: ${text}`);
  }

  return JSON.parse(text) as ArkivGateBridgeResponse;
}
