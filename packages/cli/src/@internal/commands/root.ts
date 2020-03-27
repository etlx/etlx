import commander from 'commander'

export const cliInfo = () => (cli: commander.Command) => cli
    .name('etlx')
    .description('Rx-based ETL tool')
    .version('0.1.0')
    .on('command:*', () => {
        console.error(`Invalid command: ${cli.args.join(' ')}`);
        cli.outputHelp()
        process.exit(1)
    })