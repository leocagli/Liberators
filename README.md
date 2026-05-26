# Liberators

Liberators is a Vercel-ready command center for AI agents with owned, persistent, recoverable memory on Arkiv Braga.

The core idea is simple: if an agent dies, it can be reconstructed from its decentralized `soulBackup` on Arkiv instead of depending on a fragile centralized database.

## What It Does

- Stores agent Soul backups on Arkiv Braga as queryable decentralized entities.
- Records proof logs for backup, revival, evolution, skill liberation, guardian integrity, and agent improvement.
- Lets Hermit act as Soul Guardian and integrity verifier.
- Supports Google login through NextAuth.
- Supports browser wallet connection through EIP-1193 wallets such as MetaMask.
- Runs as a Next.js app with server-side Arkiv writes, ready for Vercel deployment.

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

### Backup Soul

Frontend button: `Backup Soul`

API route:

```txt
POST /api/arkiv/soul-backup
```

Writes:

- `entityType=soulBackup`
- `proofType=soulBackupProof`
- a linked `evolutionLog`

### Revive From Arkiv

Frontend button: `Revive From Arkiv`

API route:

```txt
POST /api/arkiv/revive
```

Reads the latest decentralized `soulBackup` for the selected agent, reconstructs a new `soul`, and records a revival checkpoint.

### Agent Improvement Proof

Frontend button: `Improve`

API route:

```txt
POST /api/arkiv/improvement
```

Records an `agentImprovementProof`, useful for showing that an agent is being iterated toward competition or submission readiness.

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
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
NEXTAUTH_URL=http://localhost:3000
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

## Google Login

Google OAuth is wired with NextAuth at:

```txt
/api/auth/[...nextauth]
```

Create OAuth credentials in Google Cloud and set:

```env
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_SECRET=
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

Authorized redirect URI:

```txt
https://your-vercel-domain.vercel.app/api/auth/callback/google
```

Local redirect URI:

```txt
http://localhost:3000/api/auth/callback/google
```

## Browser Wallet Connect

The header includes a `Wallet` button that connects to an injected EIP-1193 wallet such as MetaMask.

This is separate from `ARKIV_PRIVATE_KEY`:

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
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
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

- `app/api/arkiv/soul-backup/route.ts`: writes Soul backups and backup proofs.
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
