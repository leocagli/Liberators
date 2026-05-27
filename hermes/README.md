# Hermes Runtime for Liberators

This folder contains the Hermes-side integration for the Liberators project.

Liberators is about self-evolving agents with recoverable Souls. Hermes runs separately as the persistent runtime that can improve an agent over time; the Vercel dashboard and Arkiv write APIs store evolution checkpoints and Soul backups.

## Runtime Shape

```txt
Hermes profile: valvrave   -> Evolution Master
Hermes profile: unchained  -> Skill Liberator
Hermes profile: hermit     -> Soul Guardian

Hermes skill: liberators-arkiv
Bridge scripts: hermes/bridge/*.ts
Arkiv storage: Braga through the dashboard API
```

## Install Hermes

Windows native PowerShell:

```powershell
iex (irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1)
```

WSL2, Linux, macOS, or VPS:

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

Then verify:

```bash
hermes doctor
```

## Use the Liberators Skill

Copy or symlink this skill into your Hermes skills directory:

```bash
mkdir -p ~/.hermes/skills/liberators-arkiv
cp hermes/skills/liberators-arkiv/SKILL.md ~/.hermes/skills/liberators-arkiv/SKILL.md
```

Windows native Hermes data usually lives under:

```txt
%LOCALAPPDATA%\hermes
```

## Environment

Set the API base URL for the dashboard or Vercel deployment:

```env
LIBERATORS_API_BASE_URL=http://127.0.0.1:3000
```

For local Windows + Arkiv Braga RPC, use:

```powershell
$env:NODE_OPTIONS="--use-system-ca"
```

## Bridge Commands

Record a decentralized soul backup:

```bash
npm run hermes:backup -- --agent valvrave --version v2.4.1 --integrity 99 --content "Valvrave checkpoint from Hermes."
```

Record a self-evolution proof:

```bash
npm run hermes:improve -- --agent valvrave --version v2.4.1 --integrity 99 --context "Competition readiness checkpoint."
```

Revive from Arkiv:

```bash
npm run hermes:revive -- --agent valvrave
```

Check backend wallet:

```bash
npm run hermes:wallet
```

## Profiles

The files in this folder are role definitions for Hermes:

- `SOUL.valvrave.md`
- `SOUL.unchained.md`
- `SOUL.hermit.md`

Use them as profile-level context. Each profile should load the `liberators-arkiv` skill.

## Integration Rule

Hermes does not hold the Arkiv backend private key. Hermes calls the dashboard API; the dashboard server writes to Arkiv using `ARKIV_PRIVATE_KEY`.

This keeps the browser wallet, Hermes runtime, and trusted Arkiv publisher separated.
