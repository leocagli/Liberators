import { parseAgent, parseArgs, postJson, printJson, requiredArg } from "./lib";

async function main() {
  const args = parseArgs();
  const liberatorName = parseAgent(requiredArg(args, "agent"));

  const result = await postJson("/api/arkiv/revive", {
    liberatorName,
  });

  printJson(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
