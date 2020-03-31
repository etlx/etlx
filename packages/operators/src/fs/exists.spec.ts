import path from 'path'
import { of } from 'rxjs'
import { exists } from './exists'

describe('exists', () => {
    it('return false when file do not exists', async () => {
        let actual = await of('non-existent-file').pipe(exists()).toPromise()

        expect(actual).toBeFalsy()
    })

    it('return true when directory exists', async () => {
        let actual = await of(__dirname).pipe(exists()).toPromise()

        expect(actual).toBeTruthy()
    })

    it('return true when file exists', async () => {
        let filepath = path.join(__dirname, 'exists.ts')
        let actual = await of(filepath).pipe(exists()).toPromise()

        expect(actual).toBeTruthy()
    })

    it('can use path from options', async () => {
        let filepath = path.join(__dirname, 'exists.ts')
        let actual = await of(undefined).pipe(exists(filepath)).toPromise()

        expect(actual).toBeTruthy()
    })
})