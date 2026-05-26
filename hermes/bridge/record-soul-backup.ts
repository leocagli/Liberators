import { parseAgent, parseArgs, postJson, printJson, requiredArg } from "./lib";

async function main() {
  const args = parseArgs();
  const liberatorName = parseAgent(requiredArg(args, "agent"));
  const version = args.get("version") ?? "v1.0.0";
  const integrityScore = Number(args.get("integrity") ?? 100);
  const content = args.get("content");

  if (!Number.isFinite(integrityScore)) {
    throw new Error("--integrity must be a number");
  }

  const result = await postJson("/api/arkiv/soul-backup", {
    liberatorName,
    version,
    integrityScore,
    content,
  });

  printJson(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
