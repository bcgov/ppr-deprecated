import { PersonNameModel } from '@/components/person-name-model'

describe('person-name-model.ts', (): void => {
  it('has empty names for default constructor', (): void => {
    const person = new PersonNameModel()

    expect(person.first).not.toBeDefined()
    expect(person.middle).not.toBeDefined()
    expect(person.last).not.toBeDefined()
  })

  it('has empty first name when set to be empty', (): void => {
    const person = new PersonNameModel('', 'Middle', 'Last')

    expect(person.first).toEqual('')
  })

  it('has first name when set', (): void => {
    const person = new PersonNameModel('First', 'Middle', 'Last')

    expect(person.first).toEqual('First')
  })

  it('has empty middle name when set to be empty', (): void => {
    const person = new PersonNameModel('First', '', 'Last')

    expect(person.middle).toEqual('')
  })

  it('has middle name when set', (): void => {
    const person = new PersonNameModel('First', 'Middle', 'Last')

    expect(person.middle).toEqual('Middle')
  })

  it('has empty last name when set to be empty', (): void => {
    const person = new PersonNameModel('First', 'Middle', '')

    expect(person.last).toEqual('')
  })

  it('has last name when set', (): void => {
    const person = new PersonNameModel('First', 'Middle', 'Last')

    expect(person.last).toEqual('Last')
  })

  it('is undefined when fromJsoninput is undefined', (): void => {
    const result = PersonNameModel.fromJson()

    expect(result).not.toBeDefined()
  })

  it('is an empty object when fromJson input is empty', (): void => {
    const json = {}
    const person = new PersonNameModel()
    const result = PersonNameModel.fromJson(json)

    expect(result).toEqual(person)
    expect(person.toJson()).toEqual(json)
  })

  it('is a valid object when fromJson with data', (): void => {
    const person = new PersonNameModel('First', 'Middle', 'Last')

    const expected = PersonNameModel.fromJson(person.toJson())
    expect(person).toEqual(expected)
  })

  it('is a valid object when fromJson with an apostrophe', (): void => {
    const person = new PersonNameModel("O'First", "O'Middle", "von O'Last")

    const expected = PersonNameModel.fromJson(person.toJson())
    expect(person).toEqual(expected)
  })

  it('is expected json when toJson with no data', (): void => {
    const json = {}
    const person = new PersonNameModel()

    expect(person.toJson()).toEqual(json)
    expect(PersonNameModel.fromJson(json)).toEqual(person)
  })

  it('is expected json when toJson with data', (): void => {
    const json = { first: 'First', middle: 'Middle', last: 'Last' }
    const person = new PersonNameModel('First', 'Middle', 'Last')

    expect(person.toJson()).toEqual(json)
    expect(PersonNameModel.fromJson(json)).toEqual(person)
  })

  it('is expected json when toJson with an apostrophe', (): void => {
    const json = { first: "O'First", middle: "O'Middle", last: "von O'Last" }
    const person = new PersonNameModel("O'First", "O'Middle", "von O'Last")

    expect(person.toJson()).toEqual(json)
    expect(PersonNameModel.fromJson(json)).toEqual(person)
  })
})
