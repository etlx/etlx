const { createWriteStream } = require('fs')
const { createInterface } = require('readline')

const TSFILE = 'TSFILE: '

const src = createInterface(process.stdin)
const paths = createWriteStream('build.out')

src.on('line', (line) => {
  if (line.startsWith(TSFILE)) {
    let path = line.substring(TSFILE.length)

    paths.write(`${path}\n`)
  } else {
    process.stdout.write(`${line}\n`)
  }
})

src.on('close', () => paths.end())
