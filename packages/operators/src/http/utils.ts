export const basicCredentials = (username: string, password: string) =>
  `Basic ${btoa(`${username}:${password}`)}`

export const authBasic = (credentials: { username: string, password: string }): Record<string, string> => ({
  Authorization: basicCredentials(credentials.username, credentials.password),
})


type Scalar = null | undefined | string | number | boolean
type QueryObject = { [key: string]: Scalar }
export type FormatUrlOptions = {
  host?: string,
  query?: QueryObject,
  preserveAbsoluteUrls?: boolean,
}
export function formatUrl(path: string, params?: FormatUrlOptions) {
  let { host, query, preserveAbsoluteUrls } = params || {}
  let isRelative = host === undefined && !isAbsoluteUrl(path)
  let hostUrl = host === undefined ? {} as URL : new URL(host)

  let url = new URL(path, isRelative ? 'http://stub' : host)
  url.search = query === undefined ? '' : formatQueryString(query)
  url.host = preserveAbsoluteUrls ? url.host : hostUrl.host || url.host
  url.username = hostUrl.username || url.username
  url.password = hostUrl.password || url.password

  return isRelative ? formatRelative(url) : url.toString()
}

function formatRelative(url: URL) {
  return `${url.pathname}${url.search}${url.hash}`
}

function formatQueryString(obj: QueryObject) {
  let pairs: [string, any][] = Object.entries(obj).filter(([, x]) => x !== undefined && x !== null)

  return new URLSearchParams(pairs).toString()
}

const absoluteUrlRegex = /^\w+:\/\//
function isAbsoluteUrl(url: string) {
  return absoluteUrlRegex.test(url)
}
