import { BasePartyModel } from '@/base-party/base-party-model'
import { BusinessModel } from '@/components/business-model'
import { PersonNameModel } from '@/components/person-name-model'

describe('BasePartyModel', (): void => {
  it('has empty business and person  with default constructor', (): void => {
    const model = new BasePartyModel()

    expect(model.businessName).toBeDefined()
    expect(model.personName).toBeDefined()
  })

  it('has business name when set', (): void => {
    const name = 'a business'
    const businessName = new BusinessModel(name)
    const model = new BasePartyModel(businessName)

    expect(model.businessName.businessName).toEqual(name)
  })


  it('has person name when set', (): void => {
    const name = 'a person'
    const person = new PersonNameModel(name, undefined, name)
    const model = new BasePartyModel(undefined, person)

    expect(model.personName.first).toEqual(name)
  })

  it('works with JSON', (): void => {
    const aBusiness = 'a person'
    const aPerson = 'a person'
    const businessName = new BusinessModel(aBusiness)
    const person = new PersonNameModel(aPerson, undefined, aPerson)
    const model = new BasePartyModel(businessName, person)

    const expected = BasePartyModel.fromJson(model.toJson())
    expect(model).toEqual(expected)
  })

})
