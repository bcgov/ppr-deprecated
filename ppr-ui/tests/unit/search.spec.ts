import {SearcherSerial} from '@/search/search-serial'

describe('serial search', (): void => {
  let ss: SearcherSerial

  beforeAll((): void => {
    ss = SearcherSerial.Instance('http://sample.base.url/')
  })

  it('have instance', (): void => {
    expect(ss !== undefined)
  })

  it('get description', (): void => {
    let v: string = ss.describeValidSerial
    expect(v)
  })

  it('get validation rules', (): void => {
    expect(ss.validationRules)
  })

  it('is valid', (): void => {
    expect(ss.isValid('abcd'))
    // is 25 chars
    expect(!ss.isValid('abcdefghijabcdefghijabcde'))
    // is 25 chars with characters and numbers
    expect(!ss.isValid('abcdefghij123defghijabcde'))
  })

  it('is not valid', (): void => {
    // too long
    expect(!ss.isValid('abcdefghijabcdefghijabcdefghij'))
    // contains non character
    expect(!ss.isValid('abcd$'))
  })
})

