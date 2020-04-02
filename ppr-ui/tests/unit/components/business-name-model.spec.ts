import { BusinessNameModel } from '@/components/business-name-model'

describe('business-name-model.ts', (): void => {
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

  it('is undefined when fromJsoninput is undefined', (): void => {
    const result = BusinessNameModel.fromJson()

    expect(result).not.toBeDefined()
  })

  it('is an empty object when fromJson input is empty', (): void => {
    const json = {}
    const business = new BusinessNameModel()
    const result = BusinessNameModel.fromJson(json)

    expect(result).toEqual(business)
    expect(business.toJson()).toEqual(json)
  })

  it('is a valid object when fromJson with data', (): void => {
    const business = new BusinessNameModel('aBusiness')

    const expected = BusinessNameModel.fromJson(business.toJson())
    expect(business).toEqual(expected)
  })

  it('is a valid object when fromJson with an apostrophe', (): void => {
    const business = new BusinessNameModel("O'aBusiness")

    const expected = BusinessNameModel.fromJson(business.toJson())
    expect(business).toEqual(expected)
  })

  it('is expected json when toJson with no data', (): void => {
    const business = new BusinessNameModel()

    expect(business.toJson()).toEqual({})
  })

  it('is expected json when toJson with data', (): void => {
    const business = new BusinessNameModel('aBusiness')

    expect(business.toJson()).toEqual({ businessName: 'aBusiness' })
  })

  it('is expected json when toJson with an apostrophe', (): void => {
    const business = new BusinessNameModel("O'aBusiness")

    expect(business.toJson()).toEqual({ businessName: "O'aBusiness" })
  })
})
