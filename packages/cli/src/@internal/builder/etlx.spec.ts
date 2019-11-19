import { etlx } from './etlx'
import { Observable } from 'rxjs'
import { EtlPipe } from '../pipe'

const pipe: EtlPipe = () => (o: Observable<any>) => o

describe('etlx', () => {
    it('configuration functions must not mutate builder', () => {
        const sut = etlx()

        expect(
            sut === sut.configure(x => x) ||
            sut === sut.pipe(pipe) ||
            sut === sut.pipe(pipe, 'test') ||
            sut === sut.pipe([pipe]) ||
            sut === sut.pipe({ pipe }),
        ).toBeFalsy()
    })
})