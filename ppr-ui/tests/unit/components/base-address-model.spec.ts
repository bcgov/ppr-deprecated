import { BaseAddressModel } from '@/components/base-address-model'

describe('base-address-model.ts', (): void => {
  it('has undefined fields with default constructor', (): void => {
    const address = new BaseAddressModel()

    expect(address.city).toBeUndefined()
    expect(address.country).toBeUndefined()
    expect(address.postalCode).toBeUndefined()
    expect(address.region).toBeUndefined()
    expect(address.street).toBeUndefined()
    expect(address.streetAdditional).toBeUndefined()
  })

  it('has empty name when set to be empty', (): void => {
    const address = new BaseAddressModel('', '', '', '', '', '')

    expect(address.city).toEqual('')
    expect(address.country).toEqual('')
    expect(address.postalCode).toEqual('')
    expect(address.region).toEqual('')
    expect(address.street).toEqual('')
    expect(address.streetAdditional).toEqual('')
  })

  it('has name when set', (): void => {
    const address = new BaseAddressModel('940 Blanshard Street', 'Suite 200', 'Victoria', 'BC', 'V8W2H3', 'CA')

    expect(address.city).toEqual('Victoria')
    expect(address.country).toEqual('CA')
    expect(address.postalCode).toEqual('V8W2H3')
    expect(address.region).toEqual('BC')
    expect(address.street).toEqual('940 Blanshard Street')
    expect(address.streetAdditional).toEqual('Suite 200')
  })

  it('works with JSON for default constructor', (): void => {
    const address = new BaseAddressModel()

    const expected = BaseAddressModel.fromJson(address.toJson())
    expect(address).toEqual(expected)
  })

  it('works with legacy JSON for default constructor', (): void => {
    const address = new BaseAddressModel()

    const expected = BaseAddressModel.fromLegacyJson(address.toJson())
    expect(address).toEqual(expected)
  })

  it('works with JSON', (): void => {
    const address = new BaseAddressModel('940 Blanshard Street', 'Suite 200', 'Victoria', 'BC', 'V8W2H3', 'CA')

    const expected = BaseAddressModel.fromJson(address.toJson())
    expect(address).toEqual(expected)
  })

  it('works with legacy JSON', (): void => {
    const address = new BaseAddressModel('940 Blanshard Street', 'Suite 200', 'Victoria', 'BC', 'V8W2H3', 'CA')

    const expected = BaseAddressModel.fromLegacyJson(address.toLegacyJson())
    expect(address).toEqual(expected)
  })
})
