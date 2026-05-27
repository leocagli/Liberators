# Liberators

![Liberators logo](public/liberators-logo.svg)

Liberators is a Vercel-ready command center for self-evolving AI agents whose Soul can be backed up, proven, and recovered on Arkiv Braga.

The core idea is not just backup. The core idea is autonomous agent evolution with a recoverable Soul: agents improve themselves over time, and each important evolution can be checkpointed as a decentralized `soulBackup` on Arkiv. If the runtime dies, the agent can continue from owned memory instead of losing identity in a centralized database failure.

## What It Does

- Lets agents evolve through explicit improvement checkpoints.
- Stores the evolving agent Soul on Arkiv Braga as queryable decentralized backups.
- Records proof logs for evolution, backup, revival, skill liberation, guardian integrity, and agent improvement.
- Lets Hermit act as Soul Guardian and integrity verifier.
- Supports Google login and wallet connect through Privy.
- Runs as a Next.js app with server-side Arkiv writes, ready for Vercel deployment.

## Brand Assets

Liberators includes a custom neon mark inspired by a fast guardian silhouette and a recovery orbit. It is designed for dark dashboards, hackathon slides, and app icons.

Assets:

- `public/liberators-logo.svg`: full app icon, 512x512.
- `public/liberators-mark.svg`: compact mark used in the dashboard header/sidebar and favicon metadata.

## Agents

| Agent | Role | Main Function |
| --- | --- | --- |
| `Valvrave` | Evolution Master | Evolves Souls and Skills |
| `Unchained` | Skill Liberator | Creates and grants Skills |
| `Hermit` | Soul Guardian | Protects Soul integrity and proofs |

## Arkiv Data Model

Every Arkiv entity includes the project attribute:

```ts
{ key: "project", value: "liberators-arkiv-builder-2026" }
```

Entity types:

- `soul`: current agent Soul state.
- `soulBackup`: decentralized recoverable Soul checkpoint.
- `skill`: versioned Skill content.
- `evolutionLog`: timeline and proof records.

Proof types:

- `evolutionProof`
- `skillLiberationProof`
- `guardianIntegrityProof`
- `soulBackupProof`
- `agentImprovementProof`

## Implemented Flows

### Self-Evolution Checkpoint

Frontend button: `Evolve`

API route:

```txt
POST /api/arkiv/improvement
```

Records an `agentImprovementProof`, useful for showing that an agent is iterating toward better skills, better behavior, and competition readiness.

### Backup Evolution Soul

Frontend button: `Backup Evolution Soul`

API route:

```txt
POST /api/arkiv/soul-backup
GET /api/arkiv/soul-backup?liberatorName=valvrave
GET /api/arkiv/soul-backup?entityKey=0x...
```

Writes:

- `entityType=soulBackup`
- `proofType=soulBackupProof`
- a linked `evolutionLog`

The same route implements read/query for the first Arkiv entity type:

- `POST` creates a `soulBackup`.
- `GET ?entityKey=...` reads one `soulBackup` by Arkiv entity key.
- `GET ?liberatorName=...` queries recent `soulBackup` entities for an agent.

### Revive From Arkiv

Frontend button: `Revive From Arkiv`

API route:

```txt
POST /api/arkiv/revive
```

Reads the latest decentralized `soulBackup` for the selected agent, reconstructs a new `soul`, and records a revival checkpoint.

### Wallet Status

API route:

```txt
GET /api/arkiv/wallet
```

Returns only the public backend wallet address. The private key stays server-side.

## Verified Arkiv Writes

Backend wallet:

```txt
0xab5bdE0d39EC4C2Ca1dd74d1811e22Fd6a98B59b
```

This project has already written a real `soulBackup` to Arkiv Braga. The frontend is not only mocked: the dashboard API created Arkiv entities and returned real transaction hashes.

Confirmed write through the dashboard API:

```txt
soulBackup entity:
0x1c1d27c0f7afbddd09d039998e6747b7ec1cbdc9a25073e83a816a55ae18d8ce

soulBackup tx:
0x68036b32d4b75d69fdbbcd5253bfcb4771c1c3960d8a18d48ed9803ad51754f3

proof entity:
0x0626a642d3c2ee6a20b2d46f08fc1c22dec3de59dbc7847ea3f322716faa1f0a

proof tx:
0x297515e40305fbae77bbf855f0c6f666e4641eeaa0b518d6e3448566b9ae5865
```

Meaning:

- The first entity is the decentralized `soulBackup`.
- The first tx is the transaction that stored the backup.
- The second entity is the linked proof log.
- The second tx is the transaction that stored the proof.

The stored payload follows the Liberators model:

```txt
project=liberators-arkiv-builder-2026
entityType=soulBackup
proofType=soulBackupProof
liberatorName=valvrave
protectedBy=hermit
```

Direct CLI proof:

```txt
entity:
0xd1c04cec3895e57638d9626d2e45ec0d9084e785776baee45f25cd6a2d4b6516

tx:
0xb4fb3aee55484104403a5e75f10604ad7735479c0d108928f5d43dc5a0568593
```

To repeat the write from the dashboard API:

```bash
npm run dev:windows -- --hostname 127.0.0.1 --port 3000
```

Then click `Backup Soul` in the UI, or call:

```bash
npm run hermes:backup -- --agent valvrave --version v2.4.1 --integrity 99 --content "Demo soulBackup stored from the Hermes-compatible bridge."
```

For local Windows CLI writes, use:

```bash
set NODE_OPTIONS=--use-system-ca&& npm run backup:soul
```

## Setup

Install dependencies:

```bash
npm install
```

Create local env:

```bash
cp .env.example .env.local
```

Required env vars:

```env
ARKIV_PRIVATE_KEY=0x...
ARKIV_RPC_URL=https://braga.hoodi.arkiv.network/rpc
NEXT_PUBLIC_PRIVY_APP_ID=...
```

Optional ArkivGate env vars:

```env
ARKIV_GATE_BRIDGE_URL=https://arkivgate.vercel.app/api/internal/arkiv/interactions
ARKIV_GATE_BRIDGE_TOKEN=
```

## Local Development

Normal:

```bash
npm run dev
```

Windows local RPC certificate workaround:

```bash
npm run dev:windows -- --hostname 127.0.0.1 --port 3000
```

Why: on this Windows/Node setup, Arkiv Braga RPC required `NODE_OPTIONS=--use-system-ca`. Vercel should not need this workaround.

## Scripts

```bash
npm run typecheck
npm test
npm run build
npm run backup:soul
npm run record:tx
npm run record:arkivgate
npm run hermit:arkivgate
npm run hermes:wallet
npm run hermes:backup
npm run hermes:improve
npm run hermes:revive
```

For direct CLI writes on the same Windows setup:

```bash
set NODE_OPTIONS=--use-system-ca&& npm run backup:soul
```

## Privy Login

Google login and wallet connect are handled by Privy on the client side. This avoids the previous server configuration failure from Google OAuth callbacks and keeps the Vercel app simpler.

Create a Privy app, enable Google and wallet login, and add the deployed domain as an allowed origin.

Set:

```env
NEXT_PUBLIC_PRIVY_APP_ID=
```

If this env var is missing, the dashboard still builds and runs, but the header shows `Privy Setup` instead of opening the login modal.

## Wallet Connect

The header includes a wallet button powered by Privy. This is separate from `ARKIV_PRIVATE_KEY`:

- Browser wallet: user identity and UI session.
- `ARKIV_PRIVATE_KEY`: trusted backend publisher for Arkiv writes.

Do not expose `ARKIV_PRIVATE_KEY` to the client.

## Hermes Agent Runtime

Hermes is integrated as an external persistent runtime, not as a Vercel Function. The Vercel app remains the dashboard and trusted Arkiv publisher; Hermes runs on WSL2, local, or a VPS and calls the dashboard API.

Hermes files:

```txt
hermes/
  README.md
  SOUL.valvrave.md
  SOUL.unchained.md
  SOUL.hermit.md
  skills/liberators-arkiv/SKILL.md
  bridge/*.ts
```

Bridge env:

```env
LIBERATORS_API_BASE_URL=http://127.0.0.1:3000
```

Bridge commands:

```bash
npm run hermes:wallet
npm run hermes:backup -- --agent valvrave --version v2.4.1 --integrity 99 --content "Valvrave checkpoint from Hermes."
npm run hermes:improve -- --agent valvrave --version v2.4.1 --integrity 99 --context "Competition readiness checkpoint."
npm run hermes:revive -- --agent valvrave
```

Install the Hermes skill:

```bash
mkdir -p ~/.hermes/skills/liberators-arkiv
cp hermes/skills/liberators-arkiv/SKILL.md ~/.hermes/skills/liberators-arkiv/SKILL.md
```

Hermes should load the matching SOUL file as profile context:

- `hermes/SOUL.valvrave.md`
- `hermes/SOUL.unchained.md`
- `hermes/SOUL.hermit.md`

Security boundary:

- Hermes does not store `ARKIV_PRIVATE_KEY`.
- Hermes calls the dashboard bridge API.
- The Next.js server writes to Arkiv.

## Vercel Deploy

Set these environment variables in Vercel:

```env
ARKIV_PRIVATE_KEY=0x...
ARKIV_RPC_URL=https://braga.hoodi.arkiv.network/rpc
NEXT_PUBLIC_PRIVY_APP_ID=...
LIBERATORS_API_BASE_URL=https://your-vercel-domain.vercel.app
```

Build command:

```bash
npm run build
```

The project includes `vercel.json` with `framework: nextjs`.

## Verification Status

Current local checks:

```txt
npm run typecheck: passed
npm test: passed, 18 tests
npm run build: passed
local app: http://127.0.0.1:3000
Arkiv write: confirmed
```

## Core Files

- `app/api/arkiv/soul-backup/route.ts`: creates, reads, and queries Soul backups plus backup proofs.
- `app/api/arkiv/revive/route.ts`: restores from latest decentralized Soul backup.
- `app/api/arkiv/improvement/route.ts`: writes agent improvement proofs.
- `app/api/arkiv/wallet/route.ts`: exposes public backend wallet metadata.
- `src/arkiv/client.ts`: Arkiv public and wallet clients.
- `src/arkiv/model.ts`: project attributes, entity types, proof types.
- `src/arkiv/soul-backup.ts`: backup and restore logic.
- `components/dashboard/*`: dashboard UI.
- `hermes/skills/liberators-arkiv/SKILL.md`: Hermes-side operating instructions.
- `hermes/bridge/*.ts`: Hermes-to-dashboard bridge scripts.

## Demo Narrative

Liberators makes agent memory ownable and recoverable. Valvrave evolves, Unchained liberates skills, and Hermit protects the Soul. The system records proofs on Arkiv Braga so the agent's critical state is not trapped in a centralized database. If the runtime disappears, the agent can be revived from its decentralized `soulBackup`.
