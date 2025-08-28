const { create, start } = require("../index");

jest.mock("fastify", () => () => ({
  setErrorHandler: jest.fn().mockReturnValue(true),
  register: jest.fn().mockResolvedValue(true),
  addHook: jest.fn().mockReturnValue(true),
  ready: jest.fn().mockReturnValue(true),
  close: jest.fn().mockReturnValue(true),
  listen: jest.fn((_, callback) => callback(false, "00"))
}));

jest.mock("knex", () => () => ({}));
jest.mock("../app/commons/helpers", () => ({
  connectionCheck: jest.fn().mockResolvedValue()
}));

jest.mock("fs", () => () => ({}));

let fastify;

describe("create server", () => {
  beforeAll(async () => {
    fastify = await create();
    await fastify.ready();
  });

  it("should create server", () => {
    expect(fastify).toBeDefined();
  });

  afterAll(() => {
    fastify.close();
    jest.clearAllMocks();
  });
});

describe("Start server", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should create server and log", () => {
    expect(start()).toBeDefined();
  });
});
