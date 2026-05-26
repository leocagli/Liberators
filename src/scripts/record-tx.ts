import { createLiberatorsWalletClient } from "../arkiv/client";
import { projectQueryExplorerUrl } from "../arkiv/explorer";
import { PROJECT_ATTRIBUTE } from "../arkiv/model";
import { saveEvolutionToArkiv } from "../skills/saveEvolutionToArkiv";

async function main() {
  const createdAt = Date.now();

  const result = await saveEvolutionToArkiv({
    walletClient: createLiberatorsWalletClient(),
    entry: {
      entityType: "soul",
      payload: {
        liberatorName: "valvrave",
        version: "0.1.0",
        versionNumber: 1,
        content: "Minimal Liberators memory proof written to Arkiv Braga.",
        integrityScore: 100,
        protectedBy: "hermit",
        createdAt,
      },
    },
    action: "soul_updated",
    description: "Recorded minimal Liberators transaction proof on data.arkiv.",
    timestamp: createdAt,
  });

  console.log(
    JSON.stringify(
      {
        project: PROJECT_ATTRIBUTE.value,
        entityType: "soul",
        ...result,
        projectExplorerUrl: projectQueryExplorerUrl("soul"),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
