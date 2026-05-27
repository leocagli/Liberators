---
name: liberators-arkiv
description: Use this skill when operating a self-evolving Liberators Hermes agent that needs to persist Soul backups, revive from Arkiv, record evolution proofs, or coordinate Valvrave, Unchained, and Hermit memory workflows through the Liberators dashboard API.
---

# Liberators Arkiv Skill

Liberators is a family of self-evolving AI agents whose critical Soul state is checkpointed as Arkiv entities.

Use this skill whenever:

- an agent is about to evolve;
- an agent learns an important reusable lesson or improves itself;
- a Skill is created or improved;
- Hermit needs to verify Soul integrity;
- a runtime needs to be revived from decentralized memory.

## Agents

- `valvrave`: Evolution Master. Evolves Souls and Skills.
- `unchained`: Skill Liberator. Creates and grants Skills.
- `hermit`: Soul Guardian. Verifies integrity and recovery readiness.

## Proof Types

- `soulBackupProof`: created before or after important state checkpoints.
- `agentImprovementProof`: created when an agent improves toward higher capability or competition readiness.
- `evolutionProof`: created when a Soul or Skill evolves.
- `skillLiberationProof`: created when Unchained creates or grants a Skill.
- `guardianIntegrityProof`: created when Hermit verifies integrity.

## Bridge Commands

The bridge uses `LIBERATORS_API_BASE_URL`, defaulting to `http://127.0.0.1:3000`.

Record Soul backup:

```bash
npm run hermes:backup -- --agent valvrave --version v2.4.1 --integrity 99 --content "Checkpoint content."
```

Record improvement proof:

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

## Operating Procedure

Before major changes:

1. Call `hermes:backup`.
2. Confirm the response includes `ok: true`, `entityKey`, and `txHash`.
3. Proceed with the change.

After useful improvement:

1. Summarize the improvement in one clear sentence.
2. Call `hermes:improve`.
3. Keep the returned proof identifiers in the session summary.

For revival:

1. Call `hermes:revive`.
2. Inspect the restored Soul payload.
3. Continue from the restored content.

Hermit-specific behavior:

- If a backup or proof write fails, mark the protection verdict as incomplete.
- If no `soulBackup` exists, request one before declaring the Soul secure.
- Do not invent Arkiv proofs. Only cite returned `entityKey` and `txHash`.

## Security

Hermes must not store `ARKIV_PRIVATE_KEY`.

The dashboard API is the trusted publisher. Hermes calls the API; the server writes to Arkiv.
