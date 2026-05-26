import { PROJECT_ATTRIBUTE, type EntityType } from "./model";

export const DATA_ARKIV_BASE_URL = "https://data.arkiv.network";

export function entityExplorerUrl(entityKey: string): string {
  return `${DATA_ARKIV_BASE_URL}/entity/${entityKey}`;
}

export function transactionExplorerUrl(txHash: string): string {
  return `${DATA_ARKIV_BASE_URL}/?query=${encodeURIComponent(txHash)}`;
}

export function projectQueryExplorerUrl(entityType: EntityType): string {
  const query = `${PROJECT_ATTRIBUTE.key} = "${PROJECT_ATTRIBUTE.value}" && entityType = "${entityType}"`;
  return `${DATA_ARKIV_BASE_URL}/?query=${encodeURIComponent(query)}`;
}
