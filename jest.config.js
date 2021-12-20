/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
   moduleFileExtensions: ['ts', 'js'],
   modulePathIgnorePatterns: [
      '<rootDir>/dist/',
      '<rootDir>/node_modules/',
      '<rootDir>/worker/',
   ],
   modulePaths: ['<rootDir>/src/'],
   preset: 'ts-jest',
   testMatch: [
      '**/test/**/*.[jt]s?(x)',
      '**/test/**/?(*.)+(spec|test).[jt]s?(x)',
   ],
   testPathIgnorePatterns: ['/node_modules/', '/dist/', '/worker/'],
   testTimeout: 10000,
}
