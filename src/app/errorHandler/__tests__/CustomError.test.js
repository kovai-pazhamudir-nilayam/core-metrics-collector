const CustomError = require("../CustomError");

describe("CustomError", () => {
  it("Should create custom error using create", () => {
    const err = CustomError.create({
      httpCode: 400,
      message: "test message",
      property: "test",
      code: "TEST"
    });
    expect(err).toBeInstanceOf(CustomError);
    expect(err.code).toBe(400);
    expect(err.response).toEqual({
      errors: [{ code: "TEST", message: "test message", property: "test" }]
    });
  });

  it("Should create custom error using create with object message format", () => {
    const err = CustomError.create({
      httpCode: 400,
      message: { message: "some error" },
      property: "test",
      code: "TEST"
    });
    expect(err).toBeInstanceOf(CustomError);
    expect(err.code).toBe(400);
    expect(err.response).toEqual({
      errors: [
        { code: "TEST", message: "{ message: 'some error' }", property: "test" }
      ]
    });
  });

  it("Should create custom error using constructor", () => {
    const err = new CustomError(400, null);
    expect(err).toBeInstanceOf(CustomError);
    expect(err.code).toBe(400);
    expect(err.response).toEqual({
      errors: [{ code: "BAD_REQUEST", message: "Bad request parameters" }]
    });
  });

  it("Should create custom error using constructor with blank object error", () => {
    const err = new CustomError(400, {});
    expect(err).toBeInstanceOf(CustomError);
    expect(err.code).toBe(400);
    expect(err.response).toEqual({
      errors: [{ code: "BAD_REQUEST", message: "Bad request parameters" }]
    });
  });

  it("Should create custom error using constructor with blank array error", () => {
    const err = new CustomError(400, []);
    expect(err).toBeInstanceOf(CustomError);
    expect(err.code).toBe(400);
    expect(err.response).toEqual({
      errors: [{ code: "BAD_REQUEST", message: "Bad request parameters" }]
    });
  });
});
