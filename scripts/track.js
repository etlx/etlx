const { createWriteStream } = require('fs')
const { createInterface } = require('readline')

const TSFILE = 'TSFILE: '

function main(args) {
  let filepath = args.length === 0 ? 'build.out' : args[0]
  let src = createInterface(process.stdin)
  let paths = createWriteStream(filepath)

  src.on('line', (line) => {
    if (line.startsWith(TSFILE)) {
      let path = line.substring(TSFILE.length)

      paths.write(`${path}\n`)
    } else {
      process.stdout.write(`${line}\n`)
    }
  })

  src.on('close', () => paths.end())
}

main(process.argv.slice(2))
