import { LoggerConfig } from '@etlx/operators/@internal/log'

export type ConfluenceConfig = LoggerConfig & {
    confluence: {
        host: string,
        username: string,
        password: string,
    },
}

export type ConfluencePaginatedResponse<T> = {
    results: T[],
    start: number,
    limit: number,
    size: number,
}

export type ConfluenceContentStatus = 'current' | 'thrash'

export type ConfluenceProfilePicture = {
    path: string,
    width: number,
    height: number,
    isDefault: boolean,
}

export type ConfluenceUser = {
    type: 'known',
    profilePicture: ConfluenceProfilePicture,
    username: string,
    displayName: string,
    userKey: string,
}

export type ConfluenceSpace = {
    id: string,
    key: string,
    name: string,
    type: 'global',
    homepage: ConfluencePage,
    _links: {
        self: string,
    },
}

export type ConfluenceAttachment = {
    id: string,
    type: 'attachment',
    status: ConfluenceContentStatus,
    title: string,
    metadata: { mediaType: string, comment: string },
    extensions: { mediaType: string, comment: string },
    _links: { self: string, download: string },
}

export type ConfluenceComment = {
    id: string,
    type: 'comment',
    status: ConfluenceContentStatus,
    title: string,
    extensions: any,
    _links: {
        webui: string,
        self: string,
    },
}

export type ConfluenceLabel = {
    id: string,
    name: string,
    prefix: string,
}

export type ConfluencePageHistory = {
    lastUpdated: {
        by: ConfluenceUser,
        when: string,
        message: string,
        number: number,
        minorEdit: boolean,
    },
    latest: boolean,
    createdBy: ConfluenceUser,
    createdDate: string,
}

export type ConfluencePageVersion = {
    by: ConfluenceUser,
    when: string,
    message: string,
    number: number,
    minorEdit: boolean,
}

export type ConfluencePageBodyType = 'view' | 'editor' | 'export_view' | 'storage' | 'anonymous_export_view'
export type ConfluencePageBody = {
    [P in ConfluencePageBodyType]?: {
        value: string,
        representation: P,
    }
}

export type ConfluencePage = {
    id: string,
    type: 'page',
    status: ConfluenceContentStatus,
    title: string,
    space?: ConfluenceSpace,
    history?: ConfluencePageHistory,
    version?: ConfluencePageVersion,
    ancestors?: ConfluencePage[],
    children?: {
        attachment?: ConfluencePaginatedResponse<ConfluenceAttachment>,
        comment?: ConfluencePaginatedResponse<ConfluenceComment>,
        page?: ConfluencePaginatedResponse<ConfluencePage>,
    },
    descendants?: {
        attachment?: ConfluencePaginatedResponse<ConfluenceAttachment>,
        comment?: ConfluencePaginatedResponse<ConfluenceComment>,
    },
    container?: ConfluenceSpace,
    body?: ConfluencePageBody,
    metadata?: { labels: ConfluencePaginatedResponse<ConfluenceLabel> },
    extensions: any,
    _links: {
        webui: string,
        tinyui: string,
        self: string,
    },
}

export type ConfluencePageExpandable =
    | 'container'
    | 'metadata'
        | 'metadata.labels'
    | 'children'
        | 'children.attachment'
        | 'children.comment'
        | 'children.page'
    | 'history'
        | 'history.lastUpdated'
    | 'ancestors'
        | 'ancestors.metadata'
        | 'ancestors.history'
        | 'ancestors.body'
        | 'ancestors.version'
        | 'ancestors.space'
    | 'body'
        | 'body.view'
        | 'body.editor'
        | 'body.export_view'
        | 'body.storage'
        | 'body.anonymous_export_view'
    | 'version'
    | 'descendants'
        | 'descendants.attachment'
        | 'descendants.comment'
    | 'space'
        | 'space.homepage'
        | 'space.metadata'
        | 'space.description'