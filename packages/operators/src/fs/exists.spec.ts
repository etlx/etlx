import path from 'path'
import { exists } from './exists'

describe('exists', () => {
  it('return false when file do not exists', async () => {
    let actual = await exists('non-existent-file').toPromise()

    expect(actual).toBeFalsy()
  })

  it('return true when directory exists', async () => {
    let actual = await exists(__dirname).toPromise()

    expect(actual).toBeTruthy()
  })

  it('return true when file exists', async () => {
    let filepath = path.join(__dirname, 'exists.ts')
    let actual = await exists(filepath).toPromise()

    expect(actual).toBeTruthy()
  })
})
