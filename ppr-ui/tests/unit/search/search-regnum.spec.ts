import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import {SearcherRegNum, RegNumResult, useSearcherRegNum} from '@/search/search-regnum'
import axios from '@/utils/axios-auth'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

Vue.use(VueCompositionApi)

// TODO find a way to test the provides and injects see https://github.com/bcgov/ppr/issues/377
describe.skip('provide inject', (): void => {
  it('Doc reg search module provides and injects SearcherDocReg', (): void => {
    // can not use provide outside of setup()
    // provideSearcherDocReg('http://sample.base.url/')
    const searchDocReg = useSearcherRegNum()
    expect(searchDocReg)
  })
})

describe('document registration number', (): void => {
  let ss: SearcherRegNum

  beforeAll((): void => {
    ss = SearcherRegNum.Instance('http://sample.base.url/')
  })

  it('have instance', (): void => {
    expect(ss).toBeDefined()
  })

  it('get description', (): void => {
    let v: string = ss.describeValid
    expect(v).toBeDefined()
  })

  it('get validation rules', (): void => {
    expect(ss.validationRules).toBeDefined()
    expect(ss.validationRules.length).toBeGreaterThan(1)
  })

})

describe('document registration number validation', (): void => {
  let ss: SearcherRegNum

  beforeAll((): void => {
    ss = SearcherRegNum.Instance('http://sample.base.url/')
  })
  it('is valid', (): void => {
    let vals = ['abcd', '11111111', 'abcdefgh', 'abcdefg1']
    vals.forEach((val: string): void => {
      expect(ss.validate(val)).toBeUndefined()
    })
  })

  it('is not valid', (): void => {
    // too long
    // contains non character
    // contains leading space
    let vals = ['abcdefghi', 'abcdef$', ' abcdef']
    vals.forEach((val: string): void => {
      expect(ss.validate(val)).toBeDefined()
    })
  })
})


describe('document registration number search', (): void => {
  let ss: SearcherRegNum
  let getResults: RegNumResult[] = [
    {
      "type": "EXACT",
      "financingStatement": {
        "type": "SECURITY_AGREEMENT",
        "registeringParty": {},
        "securedParties": [],
        "debtors": [],
        "vehicleCollateral": [],
        "generalCollateral": [],
        "expiryDate": null,
        "baseRegistrationNumber": "1234567",
        "documentId": "B9876543",
        "registrationDateTime": "2020-01-28T14:42:09.613834"
      }
    }
  ]

  beforeAll((): void => {
    ss = SearcherRegNum.Instance('http://sample.base.url/')
  })

  it('invoke do search valid', (): void => {
    let regNo = '111111'
    const postResponse = {data: {id: 123}}
    const getResponse = {data: getResults}
    mockedAxios.post.mockResolvedValue(postResponse)
    mockedAxios.get.mockResolvedValue(getResponse)
    ss.doSearch(regNo)
      .then((): void => {
        let results: RegNumResult[] = ss.results
        expect(results).toBeDefined()
        expect(results[0]).toBeDefined()
        expect(results[0].type).toBe('EXACT')
        expect(ss.term).toBe(regNo)
      })
      .finally((): void => {
        if (ss.errorMessage) console.error('Finally has error:', ss.errorMessage)
        expect(ss.errorMessage).toBe('')
      })
  })

  /*
  Note the following test that check for invalid queries need to have a catch or the test framework emits
  the following and allows the test to pass.

(node:61006) UnhandledPromiseRejectionWarning: Search document registration number error - Search document registration number error - invalid response data on post
(node:61006) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 4)
(node:61006) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.

   */
  it('invoke do search invalid no search term', (): void => {
    let regNo = undefined
    const postResponse = {missingData: {id: 123}}
    mockedAxios.post.mockResolvedValue(postResponse)
    ss.doSearch(regNo)
      .then((): void => {

      })
      .catch((): void => {
        expect(ss.errorMessage).toContain('invalid')
      })
  })

  it('invoke do search invalid post response data', (): void => {
    let regNo = '111111'
    const postResponse = {missingData: {id: 123}}
    const getResponse = {data: getResults}
    mockedAxios.post.mockResolvedValue(postResponse)
    mockedAxios.get.mockResolvedValue(getResponse)
    ss.doSearch(regNo)
      .then((): void => {
        // expect(ss.errorMessage).toContain('invalid')
      })
      .catch((): void => {
        expect(ss.errorMessage).toContain('invalid')
      })
  })

  it('invoke do search invalid get response data', (): void => {
    let regNo = '111111'
    const postResponse = {data: {id: 123}}
    const getResponse = {missing: getResults}
    mockedAxios.post.mockResolvedValue(postResponse)
    mockedAxios.get.mockResolvedValue(getResponse)
    ss.doSearch(regNo)
      .catch((): void => {
        expect(ss.errorMessage).toContain('invalid')
      })
  })

})
