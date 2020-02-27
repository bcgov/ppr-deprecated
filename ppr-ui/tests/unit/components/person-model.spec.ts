import { PersonModel } from '@/components/person-model'

describe('Person', (): void => {
  it('has empty names for default constructor', (): void => {
    const person = new PersonModel()

    expect(person.firstName).toEqual('')
    expect(person.middleName).toEqual('')
    expect(person.lastName).toEqual('')
  })

  it('has empty first name when set to be empty', (): void => {
    const person = new PersonModel('', 'Middle', 'Last')

    expect(person.firstName).toEqual('')
  })

  it('has first name when set', (): void => {
    const person = new PersonModel('First', 'Middle', 'Last')

    expect(person.firstName).toEqual('First')
  })

  it('has empty middle name when set to be empty', (): void => {
    const person = new PersonModel('First', '', 'Last')

    expect(person.middleName).toEqual('')
  })

  it('has middle name when set', (): void => {
    const person = new PersonModel('First', 'Middle', 'Last')

    expect(person.middleName).toEqual('Middle')
  })

  it('has empty last name when set to be empty', (): void => {
    const person = new PersonModel('First', 'Middle', '')

    expect(person.lastName).toEqual('')
  })

  it('has last name when set', (): void => {
    const person = new PersonModel('First', 'Middle', 'Last')

    expect(person.lastName).toEqual('Last')
  })

  it('works with JSON for default constructor', (): void => {
    const person = new PersonModel()

    const expected = PersonModel.fromJson(person.toJson())
    expect(person).toEqual(expected)
  })

  it('works with JSON', (): void => {
    const person = new PersonModel('First', 'Middle', 'Last')

    const expected = PersonModel.fromJson(person.toJson())
    expect(person).toEqual(expected)
  })

  it('works with JSON having spaces and apostrophes', (): void => {
    const person = new PersonModel('O\'First', 'O\'Middle', 'von O\'Last')

    const expected = PersonModel.fromJson(person.toJson())
    expect(person).toEqual(expected)
  })
})
