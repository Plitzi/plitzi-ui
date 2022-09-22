module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'html'],
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1'
  }
};
