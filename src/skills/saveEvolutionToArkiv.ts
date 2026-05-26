import {
  actionMatchesEntry,
  buildCreateEntityInput,
  buildEvolutionLogInput,
  type ArkivCreateEntityClient,
  type LiberatorEntry,
} from "../arkiv/memory";
import type { EvolutionAction } from "../arkiv/model";
import { proofTypeForAction } from "../arkiv/model";
import { entityExplorerUrl, transactionExplorerUrl } from "../arkiv/explorer";

export type SaveEvolutionToArkivInput = {
  walletClient: ArkivCreateEntityClient;
  entry: LiberatorEntry;
  action: EvolutionAction;
  description: string;
  timestamp?: number;
};

export async function saveEvolutionToArkiv(input: SaveEvolutionToArkivInput) {
  if (!actionMatchesEntry(input.action, input.entry.entityType)) {
    throw new Error(`Action ${input.action} cannot be used for ${input.entry.entityType} entries.`);
  }

  const timestamp = input.timestamp ?? Date.now();
  const entityResult = await input.walletClient.createEntity(buildCreateEntityInput(input.entry));

  const logResult = await input.walletClient.createEntity(
    buildEvolutionLogInput({
      liberatorName: input.entry.payload.liberatorName,
      action: input.action,
      description: input.description,
      timestamp,
      txHash: entityResult.txHash,
      entityKey: entityResult.entityKey,
      proofType: proofTypeForAction(input.action),
    }),
  );

  return {
    entityKey: entityResult.entityKey,
    txHash: entityResult.txHash,
    entityExplorerUrl: entityExplorerUrl(entityResult.entityKey),
    txExplorerUrl: transactionExplorerUrl(entityResult.txHash),
    logEntityKey: logResult.entityKey,
    logTxHash: logResult.txHash,
    logEntityExplorerUrl: entityExplorerUrl(logResult.entityKey),
    logTxExplorerUrl: transactionExplorerUrl(logResult.txHash),
  };
}
