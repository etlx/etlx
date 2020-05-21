export function wrapHtml(html: string) {
  return `<html><head></head><body>${html}</body></html>`
}

export function inline(str: string) {
  return str
    .replace(/\n/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\s{2,}/g, '')
}
