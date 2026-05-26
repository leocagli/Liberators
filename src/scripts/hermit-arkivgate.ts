import "dotenv/config";

import { verifySoulWithHermit } from "../liberators/hermit";

async function main() {
  const bridgeUrl = process.env.ARKIV_GATE_BRIDGE_URL;
  const bridgeToken = process.env.ARKIV_GATE_BRIDGE_TOKEN;

  if (!bridgeUrl || !bridgeToken) {
    throw new Error("ARKIV_GATE_BRIDGE_URL and ARKIV_GATE_BRIDGE_TOKEN are required.");
  }

  const result = await verifySoulWithHermit({
    bridgeUrl,
    bridgeToken,
    verification: {
      liberatorName: "valvrave",
      entityType: "soul",
      entityKey: process.env.HERMIT_TARGET_ENTITY_KEY ?? "pending-demo-entity",
      integrityScore: 100,
      content: "Hermit protected Valvrave's minimal soul proof through ArkivGate.",
      timestamp: Date.now(),
    },
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
