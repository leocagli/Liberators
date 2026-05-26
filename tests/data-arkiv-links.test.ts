import { describe, expect, it } from "vitest";

import {
  DATA_ARKIV_BASE_URL,
  entityExplorerUrl,
  projectQueryExplorerUrl,
  transactionExplorerUrl,
} from "../src/arkiv/explorer";

describe("data.arkiv explorer links", () => {
  it("builds entity and transaction links for data.arkiv", () => {
    expect(DATA_ARKIV_BASE_URL).toBe("https://data.arkiv.network");
    expect(entityExplorerUrl("0xentity")).toBe("https://data.arkiv.network/entity/0xentity");
    expect(transactionExplorerUrl("0xtx")).toBe(
      "https://data.arkiv.network/?query=0xtx",
    );
  });

  it("builds a project/entityType query link", () => {
    expect(projectQueryExplorerUrl("soul")).toBe(
      "https://data.arkiv.network/?query=project%20%3D%20%22liberators-arkiv-builder-2026%22%20%26%26%20entityType%20%3D%20%22soul%22",
    );
  });
});
