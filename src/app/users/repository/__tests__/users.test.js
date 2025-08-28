const usersRepo = require("../users");
const { logQuery } = require("../../../commons/helpers");
const { knexDefault } = require("../__mocks__/knex.mock");

jest.mock("../../../commons/helpers");

logQuery.mockReturnValue(true);

const fastify = { log: { debug: () => true } };

const { createUser } = usersRepo(fastify);

describe("users Repo", () => {
  test("Create Users should give desired response", async () => {
    const defaults = { ...knexDefault };
    defaults.insert = () => ["data"];
    const knex = () => {
      return defaults;
    };

    const response = await createUser.call(knex, {
      data: {},
      logTrace: {}
    });
    expect(response).toEqual("data");
  });
});
