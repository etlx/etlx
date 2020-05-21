import { promisifyLast } from '../@internal/utils'
import { getTextContent } from './getTextContent'

const sut = promisifyLast(getTextContent)

describe('getTextContent', () => {
    it('can skip empty strings', async () => {
        let html = ''
        let expected = ''

        let actual = await sut(html)

        expect(actual).toEqual(expected)
    })

    it('can extract text from single tag', async () => {
        let html = '<p>Text</p>'
        let expected = 'Text'

        let actual = await sut(html)

        expect(actual).toEqual(expected)
    })

    it('can extract text from multiple tags', async () => {
        let html = `
<div>
    <div>One</div>
    <div>
        <div>
            Two
            <span>Three</span>
        </div>
    </div>
</div>`
        let expected = 'One Two Three'

        let actual = await sut(html)

        expect(actual).toEqual(expected)
    })

    it('skip attributes', async () => {
        let html = '<p class="text">Text</p>'
        let expected = 'Text'

        let actual = await sut(html)

        expect(actual).toEqual(expected)
    })

    it('include body only', async () => {
        let html = `
<html>
    <head>
        <title>Title</title>
    </head>
    <body>
        <p>Text</p>
    </body>
</html>`

        let expected = 'Text'

        let actual = await sut(html)

        expect(actual).toEqual(expected)
    })

    it('can exclude tage', async () => {
        let html = `
<body>
    <p>Text</p>
    <script>console.log("Hello")</script>
</body>`
        let expected = 'Text'

        let actual = await sut(html, { excludeTags: ['script'] })

        expect(actual).toEqual(expected)
    })

    it('can truncate text', async () => {
        let html = '<p>Text Text Text</p>'

        let expected = 'Text...'

        let actual = await sut(html, { maxLength: 4, elipsis: '...' })

        expect(actual).toEqual(expected)
    })
})
