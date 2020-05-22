type Replacer = (k: string, v: any) => any
expect.extend({
  equalsJson(actual: any, expected: any, replacer?: Replacer) {
    let actualJson = JSON.stringify(actual, replacer, 2)
    let expectedJson = JSON.stringify(expected, replacer, 2)
    let isEqual = this.equals(actualJson, expectedJson)

    return isEqual
      ? { pass: true, message: () => 'Equal' }
      : { pass: false, message: () => `Not equal\n\nActual: ${actualJson}\nExpected: ${expectedJson}` }
  },
})

expect.extend({
  equals(actual: any, expected: any, testers?: jest.EqualityTester[]) {
    return {
      pass: this.equals(actual, expected, testers),
      message: () => this.utils.diff(actual, expected) || '',
    }
  },
})

declare namespace jest {
  interface Matchers<R> {
    equalsJson(expected: any, replacer: Replacer): R;
    equals(expected: any, testers?: jest.EqualityTester[]): R;
  }
}
