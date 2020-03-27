import { createConfigBuilder } from './configuration'

describe('configurationBuilder', () => {
    it('can build empty configuration', () => {
        let sut = createConfigBuilder()

        let expected = {}
        let actual = sut.build().getProperties()

        expect(actual).toEqual(expected)
    })

    it('can build configuration from object', () => {
        let sut = createConfigBuilder().addObject({ foo: 'bar' })

        let expected = { foo: 'bar' }
        let actual = sut.build().getProperties()

        expect(actual).toEqual(expected)
    })

    it('can build configuration from multiple objects', () => {
        let sut = createConfigBuilder().addObject({ foo: 'bar' }).addObject({ baz: 42 })

        let expected = { foo: 'bar', baz: 42 }
        let actual = sut.build().getProperties()

        expect(actual).toEqual(expected)
    })

    it('configuration functions must not mutate builder', () => {
        let sut = createConfigBuilder()

        expect(
            sut === sut.addObject({}) &&
            sut === sut.addSchema({}) &&
            sut === sut.warnings(false) &&
            sut === sut.addFile('test'),
        ).toBeFalsy()
    })
})