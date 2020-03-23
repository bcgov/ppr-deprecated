import { BasePartyModel } from '@/base-party/base-party-model'
import { BaseAddressModel } from '@/components/base-address-model'
import { BusinessNameModel } from '@/components/business-model'
import { PersonNameModel } from '@/components/person-name-model'

describe('BasePartyModel', (): void => {
  it('has empty business and person  with default constructor', (): void => {
    const model = new BasePartyModel()

    expect(model.businessName).toBeDefined()
    expect(model.personName).toBeDefined()
  })

  it('has business name when set', (): void => {
    const name = 'a business'
    const businessName = new BusinessNameModel(name)
    const model = new BasePartyModel(businessName)

    expect(model.businessName.businessName).toEqual(name)
  })


  it('has person name when set', (): void => {
    const name = 'a person'
    const person = new PersonNameModel(name, undefined, name)
    const model = new BasePartyModel(undefined, person)

    expect(model.personName.first).toEqual(name)
  })

  it('has address when set', (): void => {
    const address = new BaseAddressModel('940 Blanshard Street', 'Suite 200', 'Victoria', 'BC', 'V8W2H3', 'CA')
    const model = new BasePartyModel(undefined, undefined, address)

    expect(model.address.street).toEqual('940 Blanshard Street')
    expect(model.address.streetAdditional).toEqual('Suite 200')
    expect(model.address.city).toEqual('Victoria')
    expect(model.address.region).toEqual('BC')
    expect(model.address.postalCode).toEqual('V8W2H3')
    expect(model.address.country).toEqual('CA')
  })

  it('can construct using JSON', (): void => {
    const aBusiness = 'a business'
    const aPerson = 'a person'
    const address = new BaseAddressModel('940 Blanshard Street', 'Suite 200', 'Victoria', 'BC', 'V8W2H3', 'CA')
    const businessName = new BusinessNameModel(aBusiness)
    const person = new PersonNameModel(aPerson, undefined, aPerson)
    const model = new BasePartyModel(businessName, person, address)

    const expected = BasePartyModel.fromJson(model.toJson())
    expect(model).toEqual(expected)
  })

  it('can construct with undefined JSON', (): void => {
    const model = new BasePartyModel()

    const expected = BasePartyModel.fromJson(undefined)
    expect(model).toEqual(expected)
  })

})
