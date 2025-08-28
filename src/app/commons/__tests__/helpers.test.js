const { connectionCheck, getAuditInfo, logQuery } = require("../helpers");

const entity = { audit: { created_by: "user", updated_by: "user" } };
describe("Commons Helpers test", () => {
  test("Sample test", async () => {
    const response = connectionCheck({ raw: () => true });
    expect(response).toBe(true);
  });
});

describe("Audit helper", () => {
  test("getAuditInfo should give transformed response", async () => {
    const response = await getAuditInfo(entity);
    expect(response.created_by).toEqual("user");
    expect(response.updated_by).toEqual("user");
  });

  test("getAuditInfo should give transformed response 2", async () => {
    const response = await getAuditInfo({});
    expect(response.created_at).toBeDefined();
    expect(response.updated_at).toBeDefined();
  });
});

describe("Users Common helpers test", () => {
  test("logQuery test", async () => {
    const response = logQuery({
      logger: { debug: () => true },
      query: { toSQL: () => ({ method: "", sql: "", bindings: "" }) },
      context: "test",
      logTrace: {}
    });

    expect(response).toEqual(undefined);
  });
});
