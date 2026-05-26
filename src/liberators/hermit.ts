import {
  persistLiberatorEvolutionViaArkivGate,
  type ArkivGateBridgeResponse,
  type LiberatorArkivGateEvent,
} from "../arkivgate/client";
import type { LiberatorName } from "../arkiv/model";

export type HermitVerification = {
  liberatorName: Exclude<LiberatorName, "hermit">;
  entityType: "soul" | "skill";
  entityKey: string;
  integrityScore: number;
  content: string;
  timestamp?: number;
};

type PersistViaArkivGate = typeof persistLiberatorEvolutionViaArkivGate;

export function buildHermitIntegrityEvent(
  verification: HermitVerification,
): LiberatorArkivGateEvent {
  const timestamp = verification.timestamp ?? Date.now();
  const action = verification.entityType === "soul" ? "soul_updated" : "skill_evolved";

  return {
    liberatorName: "hermit",
    action,
    description: `Hermit verified ${verification.liberatorName} ${verification.entityType} integrity at ${verification.integrityScore}/100 for entity ${verification.entityKey}.`,
    content: `Guardian report: ${verification.liberatorName} ${verification.entityType} entity ${verification.entityKey} integrity=${verification.integrityScore}. ${verification.content}`,
    timestamp,
    version: "guardian-1",
    proofType: "guardianIntegrityProof",
  };
}

export async function verifySoulWithHermit(input: {
  verification: HermitVerification;
  bridgeUrl: string;
  bridgeToken: string;
  persistViaArkivGate?: PersistViaArkivGate;
}): Promise<ArkivGateBridgeResponse> {
  const persist = input.persistViaArkivGate ?? persistLiberatorEvolutionViaArkivGate;

  return persist({
    bridgeUrl: input.bridgeUrl,
    bridgeToken: input.bridgeToken,
    event: buildHermitIntegrityEvent(input.verification),
  });
}
