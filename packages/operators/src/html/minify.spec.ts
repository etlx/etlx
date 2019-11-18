import { minifyHtml } from './minify'
import { JSDOM } from 'jsdom'


describe('minify', () => {
    it('remove CRLF', () => {
        const dom = new JSDOM('\n<p>\r\n<a\nhref="#">Link</a>\r\n</p>\n')
        const expected = '<p><a href="#">Link</a></p>'

        const actual = minifyHtml(dom.window.document).body.innerHTML

        expect(actual).toEqual(expected)
    })

    it('remove tabs', () => {
        const dom = new JSDOM('\t<p>\t<a \thref="#">\tLink\t</a>\t</p>\t')
        const expected = '<p><a href="#">Link</a></p>'

        const actual = minifyHtml(dom.window.document).body.innerHTML

        expect(actual).toEqual(expected)
    })

    it('remove tag spaces', () => {
        const dom = new JSDOM('<p > <a href="#"   attr="">Link</a>  </p   >')
        const expected = '<p><a href="#" attr="">Link</a></p>'

        const actual = minifyHtml(dom.window.document).body.innerHTML

        expect(actual).toEqual(expected)
    })

    it('trim tag text', () => {
        const dom = new JSDOM('<a>   Link   </a>')
        const expected = '<a>Link</a>'

        const actual = minifyHtml(dom.window.document).body.innerHTML

        expect(actual).toEqual(expected)
    })

    it('preserve space-like chars in tag text', () => {
        const dom = new JSDOM('<a> One\tTwo\n\nThree\n</a>')
        const expected = '<a>One Two Three</a>'

        const actual = minifyHtml(dom.window.document).body.innerHTML

        expect(actual).toEqual(expected)
    })
})