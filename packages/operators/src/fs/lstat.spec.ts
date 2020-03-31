import fs from 'fs'
import path from 'path'
import { lstat } from './lstat'
import { of } from 'rxjs'

describe('lstat', () => {
    it('can get stats', async () => {
        let filepath = path.join(__dirname, 'lstat.spec.ts')
        let actual = await of(filepath).pipe(lstat()).toPromise()

        let expected = fs.lstatSync(filepath)

        expect(actual).toEqual(expected)
    })

    it('can use options filepath', async () => {
        let filepath = path.join(__dirname, 'lstat.spec.ts')
        let actual = await of(undefined).pipe(lstat(filepath)).toPromise()

        let expected = fs.lstatSync(filepath)

        expect(actual).toEqual(expected)
    })

    it('error when file does not exists', async () => {
        let filepath = 'non-existent-file'
        let actual = of(filepath).pipe(lstat()).toPromise()

        await expect(actual).rejects.toThrow(`ENOENT: no such file or directory, lstat '${filepath}'`)
    })
})