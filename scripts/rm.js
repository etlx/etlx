const { unlink } = require('fs')
const { createInterface } = require('readline')

const println = msg => process.stdout.write(`${msg}\n`)

const io = createInterface(process.stdin)

io.on('line', path => unlink(path, () => println(`RM: ${path}`)))
