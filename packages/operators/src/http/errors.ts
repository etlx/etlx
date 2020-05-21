export class HttpStatusError extends Error {
  constructor(response: { status: number, statusText: string }) {
    super(`Response status code (${response.status}) does not indicate success`)
  }
}

export class HttpMediaTypeError extends Error {
  constructor(actual: string, expected: string) {
    super(`Response media type is unexpected. Server responded with ${actual}, but ${expected} is expected`)
  }
}

export const faultyResponse = (response: { status: number, statusText: string }) =>
  new HttpStatusError(response)

export const invalidMediaType = (actual: string, expected: string) =>
  new HttpMediaTypeError(actual, expected)
