module.exports = {
  roots: ['<rootDir>/packages'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@etlx/operators/(.*)$': '<rootDir>/packages/operators/src/$1',
  },
}
