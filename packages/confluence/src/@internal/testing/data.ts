import { ConfluencePaginatedResponse, ConfluencePage, ConfluenceProfilePicture, ConfluenceUser, ConfluencePageVersion, ConfluencePageHistory } from "../.."

export const dataPage = <T>(...results: T[]): ConfluencePaginatedResponse<T> => ({
  results,
  start: 0,
  limit: results.length,
  size: 0,
})

export const page = (rest?: Partial<ConfluencePage>): ConfluencePage => ({
  id: '0',
  title: 'test',
  status: 'current',
  type: 'page',
  _links: {
    self: '',
    tinyui: '',
    webui: '',
  },
  extensions: undefined,
  ...rest,
})

export const picture = (rest?: Partial<ConfluenceProfilePicture>): ConfluenceProfilePicture =>
  ({ height: 256, width: 256, isDefault: true, path: '', ...rest })

export const user = (username: string, rest?: Partial<ConfluenceUser>): ConfluenceUser =>
  ({ username, displayName: username, userKey: username, profilePicture: picture(), type: 'known', ...rest })

export const testDate = (n: number) => new Date(Date.UTC(2009 + n, 0, 1))
const when = (n: number) => testDate(n).toISOString()

export const version = (number: number, rest?: Partial<ConfluencePageVersion>): ConfluencePageVersion =>
  ({ number, by: user('admin'), message: '', minorEdit: false, when: when(number), ...rest })

export const history = (n: number, count: number, rest?: Partial<ConfluencePageHistory>): ConfluencePageHistory => ({
  createdBy: user('admin'),
  createdDate: when(1),
  hidden: false,
  latest: n === count,
  lastUpdated: version(count),
  nextVersion: n === count ? undefined : version(n + 1),
  previousVersion: n === 1 ? undefined : version(n - 1),
  ...rest,
})
