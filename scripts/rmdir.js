const fs = require('fs')
const { promisify } = require('util')
const { join } = require('path')

const tap = (fn, sideEffect) => async (...args) => {
  let res = await fn(...args)

  sideEffect(...args)

  return res
}

const stdout = msg => process.stdout.write(`${msg}\n`)
const stderr = msg => process.stderr.write(`${msg}\n`)

const rmdir = tap(promisify(fs.rmdir), x => stdout(`RMDIR: ${x}`))
const readdir = promisify(fs.readdir)
const lstat = promisify(fs.lstat)

const toStat = path => lstat(path).then(stat => ({ path, dir: stat.isDirectory() }))

const removeEmptyDirectories = async (dir) => {
  let paths = (await readdir(dir)).map(x => join(dir, x))
  if (paths.length === 0) {
    rmdir(dir)
    return true
  }

  let stats = await Promise.all(paths.map(toStat))
  let children = stats.filter(x => x.dir).map(x => x.path)
  let results = await Promise.all(children.map(removeEmptyDirectories))
  let isEmpty = results.every(Boolean) && results.length === stats.length

  if (isEmpty) {
    rmdir(dir)
    return true
  } else {
    return false
  }
}

function main(args) {
  let root = args.length === 0 ? '.' : args[0]
  removeEmptyDirectories(root).catch(stderr)
}

main(process.argv.slice(2))
