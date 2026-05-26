import "dotenv/config";

import { persistLiberatorEvolutionViaArkivGate } from "../arkivgate/client";

async function main() {
  const bridgeUrl = process.env.ARKIV_GATE_BRIDGE_URL;
  const bridgeToken = process.env.ARKIV_GATE_BRIDGE_TOKEN;

  if (!bridgeUrl || !bridgeToken) {
    throw new Error("ARKIV_GATE_BRIDGE_URL and ARKIV_GATE_BRIDGE_TOKEN are required.");
  }

  const timestamp = Date.now();
  const result = await persistLiberatorEvolutionViaArkivGate({
    bridgeUrl,
    bridgeToken,
    event: {
      liberatorName: "valvrave",
      action: "soul_updated",
      description: "Liberators wrote a minimal evolution proof through ArkivGate.",
      content: "Valvrave v0.1.0 memory proof routed through ArkivGate.",
      version: "0.1.0",
      timestamp,
    },
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
