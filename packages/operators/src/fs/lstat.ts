import fs from 'fs'
import { bindNodeCallback } from 'rxjs'


export const lstat = bindNodeCallback(fs.lstat)