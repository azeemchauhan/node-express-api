const { pathsToModuleNameMapper } = require('ts-jest');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: pathsToModuleNameMapper(
    {
      "@config/*": ["src/config/*"],
      "@controllers/*": ["src/controllers/*"],
      "@routes/*": ["src/routes/*"],
      "@models/*": ["./src/models/*"],
      "@middlewares/*": ["src/middlewares/*"],
      "@utils/*": ["src/utils/*"]
    },
    { prefix: '<rootDir>/' }),
    globalSetup: "<rootDir>/tests/setup.api.ts",
};