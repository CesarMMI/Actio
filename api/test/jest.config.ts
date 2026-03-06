import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  // Root is the API package directory
  rootDir: '..',
  // When running `npm test` with this base config,
  // exclude e2e tests so they only run via the e2e config.
  testPathIgnorePatterns: ['<rootDir>/test/e2e/'],
};

export default config;
