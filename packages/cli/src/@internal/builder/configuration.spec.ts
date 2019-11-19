import { createConfigBuilder } from './configuration'

describe('configurationBuilder', () => {
    it('can build empty configuration', () => {
        const sut = createConfigBuilder()

        const expected = {}
        const actual = sut.build().getProperties()

        expect(actual).toEqual(expected)
    })

    it('can build configuration from object', () => {
        const sut = createConfigBuilder().addObject({ foo: 'bar' })

        const expected = { foo: 'bar' }
        const actual = sut.build().getProperties()

        expect(actual).toEqual(expected)
    })

    it('can build configuration from multiple objects', () => {
        const sut = createConfigBuilder().addObject({ foo: 'bar' }).addObject({ baz: 42 })

        const expected = { foo: 'bar', baz: 42 }
        const actual = sut.build().getProperties()

        expect(actual).toEqual(expected)
    })

    it('configuration functions must not mutate builder', () => {
        const sut = createConfigBuilder()

        expect(
            sut === sut.addObject({}) &&
            sut === sut.addSchema({}) &&
            sut === sut.warnings(false) &&
            sut === sut.addFile('test'),
        ).toBeFalsy()
    })
})