const { unlink, createReadStream, existsSync } = require('fs')
const { createInterface } = require('readline')

const println = msg => process.stdout.write(`${msg}\n`)

function main(args) {
  let filepath = args.length === 0 ? 'build.out' : args[0]

  if (!existsSync(filepath)) {
    return
  }

  let src = createReadStream(filepath, { encoding: 'utf8' })
  let io = createInterface(src)

  io.on('line', path => unlink(path, () => println(`RM: ${path}`)))
  io.on('close', () => unlink(filepath, () => println(`RM: ${filepath}`)))
}

main(process.argv.slice(2))
