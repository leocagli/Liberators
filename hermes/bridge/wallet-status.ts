import { getJson, printJson } from "./lib";

async function main() {
  const result = await getJson("/api/arkiv/wallet");

  printJson(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
