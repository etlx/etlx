import convict from 'convict'
import { notNullOrUndefined, flatten } from '../../../../utils'

type DocObject = { name: string, parent?: DocObject }
type DocProp = {
    name: string,
    format?: string,
    env?: string,
    arg?: string,
    default?: string,
    doc?: string,
    parent?: DocObject,
}

export function getDocs(config: convict.Config<any>): DocProp[] {
    return handleObjectSchema(<any>config.getSchema())

    function handleObjectSchema(node: { properties: convict.Schema<any> }, name?: string, parent?: DocObject): DocProp[] {
        let currentParent = name === undefined ? undefined : { name, parent }
        let arrays = Object.entries(node.properties).map(([name, value]) => {
            return handlePropertySchema(value, name, currentParent)
        })

        return flatten(arrays)
    }

    function handlePropertySchema<T>(node: convict.Schema<T> | convict.SchemaObj<T>, name: string, parent?: DocObject): DocProp[] {
        if (isObjectSchema(node)) {
            return handleObjectSchema(<any>node, name, parent)
        }

        let prop = node as convict.SchemaObj<T>

        let doc: DocProp = {
            name,
            parent,
            doc: prop.doc,
            env: prop.env,
            arg: prop.arg,
            default: JSON.stringify(prop.default),
            format: prop.format === undefined ? 'unknown' : prop.format.toString(),
        }

        return [doc]
    }

    function isObjectSchema<T>(obj: any): boolean {
        let keys = Object.keys(obj)
        return keys.length === 1 && keys[0] === 'properties'
    }
}

export function formatDocs(docs: DocProp[]) {
    let br = '\n'

    let lines = docs
        .filter(x => x.name)
        .reduce(
        (acc, doc) => {
            let arg = doc.arg ? `--${doc.arg}` : undefined
            let alt = [doc.env, arg].filter(Boolean).map(x => `\`${x}\``).join(', ')
            alt = alt ? ` (${alt})` : ''
            let title = `### ${formatBreadcrumbs(doc)}${alt}${br}`
            let desc = doc.doc ? `${doc.doc}${br}` : undefined
            let format = `* format: ${doc.format || '*'}`
            let required = `* required: ${doc.default === 'null'}`
            let defaultValue = doc.default === 'null' || doc.default === undefined ? undefined : `* default: ${doc.default}`

            const result = [
                title,
                desc,
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

function formatBreadcrumbs(doc: DocObject): string {
    if (!doc.parent) {
        return doc.name
    } else {
        return `${formatBreadcrumbs(doc.parent)}:${doc.name}`
    }
}
