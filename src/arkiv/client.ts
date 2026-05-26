import { config as loadEnv } from "dotenv";

import { createPublicClient, createWalletClient, http } from "@arkiv-network/sdk";
import { braga } from "@arkiv-network/sdk/chains";

import { getConfiguredArkivAccount } from "./wallet";

loadEnv({ path: ".env.local" });
loadEnv();

export const ARKIV_BRAGA_RPC_URL =
  process.env.ARKIV_RPC_URL ?? "https://braga.hoodi.arkiv.network/rpc";

export function createLiberatorsPublicClient() {
  return createPublicClient({
    chain: braga,
    transport: http(ARKIV_BRAGA_RPC_URL),
  });
}

export function createLiberatorsWalletClient() {
  return createWalletClient({
    chain: braga,
    transport: http(ARKIV_BRAGA_RPC_URL),
    account: getConfiguredArkivAccount(),
  });
}
