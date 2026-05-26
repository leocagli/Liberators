import { createLiberatorsWalletClient } from "../arkiv/client";
import { saveSoulBackupToArkiv } from "../arkiv/soul-backup";

async function main() {
  const createdAt = Date.now();

  const result = await saveSoulBackupToArkiv({
    walletClient: createLiberatorsWalletClient(),
    backup: {
      liberatorName: "valvrave",
      version: process.env.SOUL_VERSION ?? "0.1.0",
      versionNumber: Number(process.env.SOUL_VERSION_NUMBER ?? 1),
      content:
        process.env.SOUL_CONTENT ??
        "Valvrave soul backup: decentralized recovery state for the Liberators agent family.",
      integrityScore: Number(process.env.SOUL_INTEGRITY_SCORE ?? 100),
      protectedBy: "hermit",
      backupReason: "manual_checkpoint",
      createdAt,
    },
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
