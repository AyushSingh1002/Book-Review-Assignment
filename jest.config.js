const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  testMatch: ['**/tests/**/*.ts'], // 👈 Matches your tests/bookTest.ts
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  roots: ['<rootDir>/tests'], // Optional, helps Jest scan faster
  "globals": {
    "NODE_ENV": "test"
  }
};