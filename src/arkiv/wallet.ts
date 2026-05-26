import { privateKeyToAccount } from "@arkiv-network/sdk/accounts";

export function getConfiguredArkivAccount() {
  const privateKey = process.env.ARKIV_PRIVATE_KEY;

  if (!privateKey || privateKey === "0x") {
    throw new Error("ARKIV_PRIVATE_KEY is required for Arkiv write operations.");
  }

  return privateKeyToAccount(privateKey as `0x${string}`);
}
