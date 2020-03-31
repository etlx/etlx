import { seconds, minutes, hours, days } from "./utils"

type F = (x: number) => number
const sut: [F, string, number][] = [
    [seconds, 'seconds', 1e3],
    [minutes, 'minutes', 60e3],
    [hours, 'hours', 60 * 60e3],
    [days, 'days', 24 * 60 * 60e3],
]

const data = (k: number) => [
    [-1, -k],
    [0, 0],
    [1, k],
    [2, 2 * k],
    [1000, 1000 * k],
    [NaN, NaN],
]

describe('time/utils', () =>
    sut.forEach(([f, name, k]) =>
        data(k).forEach(([init, expected]) =>
            it(`${name}(${init})`, () =>
                expect(f(init)).toEqual(expected)
            )
        )
    )
)
