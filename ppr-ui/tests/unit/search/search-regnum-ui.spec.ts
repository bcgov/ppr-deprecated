import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'

import SearcherRegNumHelper from '@/search/search-regnum-ui'

Vue.use(VueCompositionApi)

describe('search-regnum-ui.ts', (): void => {
  let ss: SearcherRegNumHelper

  beforeAll((): void => {
    ss = new SearcherRegNumHelper()
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
  let ss: SearcherRegNumHelper

  beforeAll((): void => {
    ss = new SearcherRegNumHelper()
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
