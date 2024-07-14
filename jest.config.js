module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  testMatch: ["**/*.test.ts"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["server/**/*.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
