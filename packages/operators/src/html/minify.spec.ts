import { JSDOM } from 'jsdom'
import { minifyHtml } from './minify'


describe('minify', () => {
    it('remove CRLF', () => {
        let dom = new JSDOM('\n<p>\r\n<a\nhref="#">Link</a>\r\n</p>\n')
        let expected = '<p><a href="#">Link</a></p>'

        let actual = minifyHtml(dom.window.document).body.innerHTML

        expect(actual).toEqual(expected)
    })

    it('remove tabs', () => {
        let dom = new JSDOM('\t<p>\t<a \thref="#">\tLink\t</a>\t</p>\t')
        let expected = '<p><a href="#">Link</a></p>'

        let actual = minifyHtml(dom.window.document).body.innerHTML

        expect(actual).toEqual(expected)
    })

    it('remove tag spaces', () => {
        let dom = new JSDOM('<p > <a href="#"   attr="">Link</a>  </p   >')
        let expected = '<p><a href="#" attr="">Link</a></p>'

        let actual = minifyHtml(dom.window.document).body.innerHTML

        expect(actual).toEqual(expected)
    })

    it('trim tag text', () => {
        let dom = new JSDOM('<a>   Link   </a>')
        let expected = '<a>Link</a>'

        let actual = minifyHtml(dom.window.document).body.innerHTML

        expect(actual).toEqual(expected)
    })

    it('preserve space-like chars in tag text', () => {
        let dom = new JSDOM('<a> One\tTwo\n\nThree\n</a>')
        let expected = '<a>One Two Three</a>'

        let actual = minifyHtml(dom.window.document).body.innerHTML

        expect(actual).toEqual(expected)
    })
})
