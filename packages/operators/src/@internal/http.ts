export const encodeBasicCredentials = (username: string, password: string) =>
    `Basic ${btoa(`${username}:${password}`)}`

export const authBasic = (credentials: { username: string, password: string }) => ({
    Authorization: encodeBasicCredentials(credentials.username, credentials.password),
})

type HttpResponse = {
    status: number,
    statusText: string,
}

export class HttpError extends Error {
    public readonly type: string = 'HttpError'

    constructor(response: HttpResponse) {
        super(`Response status (${response.status} ${response.statusText}) code does not indicate success.`)
    }
}

export function ensureSuccessStatusCode(response: HttpResponse) {
    if (response.status >= 100 && response.status < 400) {
        return
    } else {
        throw new HttpError(response)
    }
}

export const applicationJsonHeader: Record<string, string> = ({ 'Content-Type': 'application/json' })


const getQueryParams = (obj: any) => {
    const pairs: [string, any][] = Object.entries(obj).filter(x => x[1] !== undefined)
    return new URLSearchParams(pairs)
}

export const formatUrl = (path: string, params?: {
    host?: string,
    query?: { [key: string]: any },
}) => {
    const { host, query } = params || { host: undefined, query: undefined }

    const isRelative = host === undefined
    const searchString = query === undefined ? '' : getQueryParams(query).toString()

    const url = new URL(path, isRelative ? 'http://stub' : host)
    url.search = searchString

    return isRelative ? `${url.pathname}${url.search}` : url.toString()
}