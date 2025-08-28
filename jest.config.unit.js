module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  testMatch: ["<rootDir>/(src|db-config)/**/?(*.)test.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/app/**/__mocks__/*.js",
    "!src/app/plugins/**/*.js",
    "!src/app/hooks/**/*.js",
    "!src/app/commons/configs.js"
  ],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50
    }
  },
  testResultsProcessor: "jest-sonar-reporter"
};
