import { BasePartyModel } from '@/base-party/base-party-model'
import { BusinessNameModel } from '@/components/business-name-model'
import { PersonNameModel } from '@/components/person-name-model'

describe('BasePartyModel', (): void => {
  it('has undefined business and person with default constructor', (): void => {
    const model = new BasePartyModel()

    expect(model.businessName).not.toBeDefined()
    expect(model.personName).not.toBeDefined()
  })

  it('has business name when set', (): void => {
    const name = 'a business'
    const businessName = new BusinessNameModel(name)
    const model = new BasePartyModel(businessName)

    expect(model.businessName?.businessName).toEqual(name)
  })


  it('has person name when set', (): void => {
    const name = 'a person'
    const person = new PersonNameModel(name, undefined, name)
    const model = new BasePartyModel(undefined, person)

    expect(model.personName?.first).toEqual(name)
  })

  it('toJson produces no fields', (): void => {
    const model = new BasePartyModel()

    const json = model.toJson()

    expect(json).toBeDefined()
    expect(json.businessName).not.toBeDefined()
    expect(json.personName).not.toBeDefined()
    expect(BasePartyModel.fromJson(json)).toEqual(model)
  })

  it('toJson produces all fields', (): void => {
    const businessName = 'Business Name'
    const personFirstName = 'First Name'
    const personMiddleName = 'Middle Name'
    const personLastName = 'Last Name'
    const business = new BusinessNameModel(businessName)
    const person = new PersonNameModel(personFirstName, personMiddleName, personLastName)
    const model = new BasePartyModel(business, person)

    const json = model.toJson()

    expect(json).toBeDefined()
    expect(json.businessName).toBe(businessName)
    expect(json.personName).toBeDefined()
    expect(json.personName?.first).toBe(personFirstName)
    expect(json.personName?.middle).toBe(personMiddleName)
    expect(json.personName?.last).toBe(personLastName)
  })

  it('can construct using JSON', (): void => {
    const aBusiness = 'a business'
    const aPerson = 'a person'
    const businessName = new BusinessNameModel(aBusiness)
    const person = new PersonNameModel(aPerson, undefined, aPerson)
    const model = new BasePartyModel(businessName, person)

    const result = BasePartyModel.fromJson(model.toJson())
    expect(model).toEqual(result)
  })

  it('can construct with undefined JSON', (): void => {
    const result = BasePartyModel.fromJson(undefined)

    expect(result).not.toBeDefined()
  })

})
