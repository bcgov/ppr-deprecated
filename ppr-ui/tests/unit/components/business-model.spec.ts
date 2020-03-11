import { BusinessNameModel } from '@/components/business-model'

describe('Business', (): void => {
  it('has undefined name with default constructor', (): void => {
    const business = new BusinessNameModel()

    expect(business.businessName).toBeUndefined()
  })

  it('has empty name when set to be empty', (): void => {
    const business = new BusinessNameModel('')

    expect(business.businessName).toEqual('')
  })

  it('has name when set', (): void => {
    const business = new BusinessNameModel('aBusiness')

    expect(business.businessName).toEqual('aBusiness')
  })

  it('works with JSON for default constructor', (): void => {
    const business = new BusinessNameModel()

    const expected = BusinessNameModel.fromJson(business.toJson())
    expect(business).toEqual(expected)
  })

  it('works with JSON', (): void => {
    const business = new BusinessNameModel('aBusiness')

    const expected = BusinessNameModel.fromJson(business.toJson())
    expect(business).toEqual(expected)
  })

  it('works with JSON having spaces and apostrophes', (): void => {
    const business = new BusinessNameModel('O\'aBusiness')

    const expected = BusinessNameModel.fromJson(business.toJson())
    expect(business).toEqual(expected)
  })
})
