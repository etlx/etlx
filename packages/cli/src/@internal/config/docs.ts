import convict from 'convict'
import { notNullOrUndefined, flatMap } from '../utils'

type DocObject = { name: string, parent?: DocObject }
type DocProp = {
    name: string,
    format?: string,
    env?: string,
    default?: string,
    doc?: string,
    parent?: DocObject,
}

export function getDocs(config: convict.Config<any>): DocProp[] {
    return handleObjectSchema(<any>config.getSchema())

    function handleObjectSchema(node: { properties: convict.Schema<any> }, name?: string, parent?: DocObject): DocProp[] {
        const currentParent = name === undefined ? undefined : { name, parent }
        const arrays = Object.entries(node.properties).map(([name, value]) => {
            return handlePropertySchema(value, name, currentParent)
        })

        return flatMap(arrays)
    }

    function handlePropertySchema<T>(node: convict.Schema<T> | convict.SchemaObj<T>, name: string, parent?: DocObject): DocProp[] {
        if (isObjectSchema(node)) {
            return handleObjectSchema(<any>node, name, parent)
        }

        const prop = node as convict.SchemaObj<T>

        const doc: DocProp = {
            name,
            parent,
            doc: prop.doc,
            env: prop.env,
            default: JSON.stringify(prop.default),
            format: prop.format === undefined ? 'unknown' : prop.format.toString(),
            }

        return [doc]
    }

    function isObjectSchema<T>(obj: any): boolean {
        const keys = Object.keys(obj)
        return keys.length === 1 && keys[0] === 'properties'
    }
}

export function formatDocs(docs: DocProp[]) {
    const formatBreadcrumbs = (doc: DocObject): string => {
        if (doc.parent === undefined) {
            return doc.name
        } else {
            return `${formatBreadcrumbs(doc.parent)}:${doc.name}`
        }
    }

    const lines = docs.reduce(
        (acc, doc) => {
            const br = '\n'
            const title = `## ${formatBreadcrumbs(doc)}${doc.env === undefined ? '' : ` (${doc.env})`}`
            const desc = doc.doc === undefined ? undefined : doc.doc
            const format = `* format: ${doc.format}`
            const required = `* required: ${doc.default === 'null'}`
            const defaultValue = doc.default === 'null' ? undefined : `* default: ${doc.default}`

            const result = [
                title,
                br,
                desc,
                br,
                format,
                required,
                defaultValue,
                br,
            ]

            return [...acc, ...result.filter(notNullOrUndefined)]
        },
        [],
    )

    return lines.join('\n')
}
