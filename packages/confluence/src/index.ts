export * from './types'
export * from './getSpaceContent'
export * from './getPageAttachments'
export * from './normalizeBody'
export * from './excerptBody'
export * from './getPageById'
export * from './fetchHistory'

export const configSchema = {
  confluence: {
    host: {
      doc: 'Confluence server address',
      format: 'url',
      env: 'CONFLUENCE_HOST',
      default: null,
    },
    username: {
      doc: 'Confluence user under which API calls will be made',
      format: String,
      env: 'CONFLUENCE_USER',
      default: null,
    },
    password: {
      doc: 'Confluence user password',
      format: String,
      env: 'CONFLUENCE_PASSWORD',
      sensitive: true,
      default: null,
    },
  },
}
