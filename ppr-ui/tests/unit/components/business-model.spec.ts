import { BusinessModel } from '@/components/business-model'

describe('Business', (): void => {
  it('has undefined name with default constructor', (): void => {
    const business = new BusinessModel()

    expect(business.businessName).toBeUndefined()
  })

  it('has empty name when set to be empty', (): void => {
    const business = new BusinessModel('')

    expect(business.businessName).toEqual('')
  })

  it('has name when set', (): void => {
    const business = new BusinessModel('aBusiness')

    expect(business.businessName).toEqual('aBusiness')
  })

  it('works with JSON for default constructor', (): void => {
    const business = new BusinessModel()

    const expected = BusinessModel.fromJson(business.toJson())
    expect(business).toEqual(expected)
  })

  it('works with JSON', (): void => {
    const business = new BusinessModel('aBusiness')

    const expected = BusinessModel.fromJson(business.toJson())
    expect(business).toEqual(expected)
  })

  it('works with JSON having spaces and apostrophes', (): void => {
    const business = new BusinessModel('O\'aBusiness')

    const expected = BusinessModel.fromJson(business.toJson())
    expect(business).toEqual(expected)
  })
})
