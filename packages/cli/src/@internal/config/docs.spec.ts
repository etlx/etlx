import { formatDocs } from './docs'

const inline = (str: string) => str
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()

describe('formatDocs', () => {
    it('can format docs', () => {
        const expected = '## test (TEST) description * format: string * required: false * default: 42'

        const actual = formatDocs([{
            name: 'test',
            doc: 'description',
            format: 'string',
            default: '42',
            env: 'TEST',
            parent: undefined,
        }])

        expect(inline(actual)).toEqual(expected)
    })
})