import { z } from "zod";

export const LiberatorNameSchema = z.enum(["valvrave", "unchained", "hermit"]);

export type LiberatorName = z.infer<typeof LiberatorNameSchema>;

export function getApiBaseUrl() {
  return (process.env.LIBERATORS_API_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = new Map<string, string>();

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[i + 1];

    if (!next || next.startsWith("--")) {
      args.set(key, "true");
      continue;
    }

    args.set(key, next);
    i += 1;
  }

  return args;
}

export function requiredArg(args: Map<string, string>, name: string) {
  const value = args.get(name);

  if (!value) {
    throw new Error(`Missing required argument --${name}`);
  }

  return value;
}

export function parseAgent(value: string): LiberatorName {
  return LiberatorNameSchema.parse(value);
}

export async function postJson(path: string, body: unknown) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.error ?? `Request failed with ${response.status}`);
  }

  return data;
}

export async function getJson(path: string) {
  const response = await fetch(`${getApiBaseUrl()}${path}`);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error ?? `Request failed with ${response.status}`);
  }

  return data;
}

export function printJson(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}
