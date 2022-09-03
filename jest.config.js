module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['js', 'vue', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/pages/**/*.vue',
  ],
  // setupFilesAfterEnv: [
  //   'bdd-lazy-var',
  //   'bdd-lazy-var/global',
  // ],
  // testRunner: 'jest-jasmine2',
  setupFiles: ['./test/jest-setup.js'],
  testEnvironment: 'jsdom',
}
