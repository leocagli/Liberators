import { describe, expect, it } from "vitest";

import {
  LIBERATOR_NAMES,
  PROJECT_ATTRIBUTE,
  buildEvolutionLogAttributes,
  buildSkillAttributes,
  buildSoulAttributes,
} from "../src/arkiv/model";
import {
  EvolutionLogSchema,
  SkillEntrySchema,
  SoulEntrySchema,
} from "../src/arkiv/schemas";

describe("Liberators Arkiv model", () => {
  it("uses a globally specific project namespace", () => {
    expect(PROJECT_ATTRIBUTE).toEqual({
      key: "project",
      value: "liberators-arkiv-builder-2026",
    });
  });

  it("defines the three Liberator identities", () => {
    expect(LIBERATOR_NAMES).toEqual(["valvrave", "unchained", "hermit"]);
  });

  it("builds queryable SoulEntry attributes with numeric fields as numbers", () => {
    const attributes = buildSoulAttributes({
      liberatorName: "valvrave",
      version: "1.0.0",
      versionNumber: 1,
      integrityScore: 96,
      createdAt: 1_779_753_600_000,
    });

    expect(attributes).toContainEqual(PROJECT_ATTRIBUTE);
    expect(attributes).toContainEqual({ key: "entityType", value: "soul" });
    expect(attributes).toContainEqual({ key: "proofType", value: "evolutionProof" });
    expect(attributes).toContainEqual({ key: "liberatorName", value: "valvrave" });
    expect(attributes).toContainEqual({ key: "versionNumber", value: 1 });
    expect(attributes).toContainEqual({ key: "integrityScore", value: 96 });
    expect(attributes).toContainEqual({ key: "createdAt", value: 1_779_753_600_000 });
  });

  it("builds SkillEntry attributes with relationship keys", () => {
    const attributes = buildSkillAttributes({
      liberatorName: "unchained",
      skillName: "saveEvolutionToArkiv",
      version: "1.0.0",
      versionNumber: 1,
      createdByLiberator: "unchained",
      evolvedByLiberator: "valvrave",
      previousEntityKey: "0xprevious",
      createdAt: 1_779_753_600_000,
    });

    expect(attributes).toContainEqual({ key: "entityType", value: "skill" });
    expect(attributes).toContainEqual({ key: "proofType", value: "skillLiberationProof" });
    expect(attributes).toContainEqual({ key: "skillName", value: "saveEvolutionToArkiv" });
    expect(attributes).toContainEqual({ key: "createdByLiberator", value: "unchained" });
    expect(attributes).toContainEqual({ key: "evolvedByLiberator", value: "valvrave" });
    expect(attributes).toContainEqual({ key: "previousEntityKey", value: "0xprevious" });
  });

  it("builds EvolutionLog attributes for timeline queries", () => {
    const attributes = buildEvolutionLogAttributes({
      liberatorName: "hermit",
      action: "soul_updated",
      entityKey: "0xsoul",
      createdAt: 1_779_753_600_000,
    });

    expect(attributes).toContainEqual({ key: "entityType", value: "evolutionLog" });
    expect(attributes).toContainEqual({ key: "proofType", value: "guardianIntegrityProof" });
    expect(attributes).toContainEqual({ key: "action", value: "soul_updated" });
    expect(attributes).toContainEqual({ key: "entityKey", value: "0xsoul" });
  });

  it("validates entity payloads before use", () => {
    expect(() =>
      SoulEntrySchema.parse({
        liberatorName: "valvrave",
        version: "1.0.0",
        versionNumber: 1,
        content: "Valvrave evolves souls and skills.",
        integrityScore: 100,
        protectedBy: "hermit",
        createdAt: 1_779_753_600_000,
      }),
    ).not.toThrow();

    expect(() =>
      SkillEntrySchema.parse({
        liberatorName: "unchained",
        skillName: "saveEvolutionToArkiv",
        version: "1.0.0",
        versionNumber: 1,
        content: "export async function saveEvolutionToArkiv() {}",
        createdByLiberator: "unchained",
        evolvedByLiberator: "valvrave",
        createdAt: 1_779_753_600_000,
      }),
    ).not.toThrow();

    expect(() =>
      EvolutionLogSchema.parse({
        liberatorName: "hermit",
        action: "skill_created",
        description: "Unchained liberated the first Arkiv memory skill.",
        timestamp: 1_779_753_600_000,
        txHash: "0xtx",
        entityKey: "0xskill",
      }),
    ).not.toThrow();
  });
});
