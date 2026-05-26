import { createLiberatorsWalletClient } from "../arkiv/client";
import { saveEvolutionToArkiv } from "../skills/saveEvolutionToArkiv";

async function main() {
  const createdAt = Date.now();

  const result = await saveEvolutionToArkiv({
    walletClient: createLiberatorsWalletClient(),
    entry: {
      entityType: "soul",
      payload: {
        liberatorName: "valvrave",
        version: "1.0.0",
        versionNumber: 1,
        content: "Valvrave is the Evolution Master of the Liberators family.",
        integrityScore: 96,
        protectedBy: "hermit",
        createdAt,
      },
    },
    action: "soul_updated",
    description: "Initialized Valvrave's first SoulEntry on Arkiv Braga.",
    timestamp: createdAt,
  });

  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
