import commander from 'commander'

export type RootCommandOptions = {
    name?: string,
    description?: string,
    version?: string,
}
export const rootCommand = (options?: RootCommandOptions) => {
    let opts = options || {}

    return (cli: commander.Command) => cli
        .name(opts.name || 'etlx')
        .description(opts.description || 'Rx-based ETL tool')
        .version(opts.version || '0.1.0')
        .on('command:*', () => {
            console.error(`Invalid command: ${cli.args.join(' ')}`)
            cli.outputHelp()
            process.exit(1)
        })
}