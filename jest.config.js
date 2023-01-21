module.exports = {
  clearMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: [
    'js',
    'vue',
    'json'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '!**/node_modules/**',
    '<rootDir>/components/**/*.vue'
  ],
  coverageReporters: [
    'html',
    'json',
    'json-summary',
    'lcov',
    'text'
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.js']
}
