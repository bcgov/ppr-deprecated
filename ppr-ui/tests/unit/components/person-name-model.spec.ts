import { PersonNameModel } from '@/components/person-name-model'

describe('person-name-model', (): void => {
  it('has empty names for default constructor', (): void => {
    const person = new PersonNameModel()

    expect(person.first).toEqual('')
    expect(person.middle).toEqual('')
    expect(person.last).toEqual('')
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

  it('works with JSON for default constructor', (): void => {
    const person = new PersonNameModel()

    const expected = PersonNameModel.fromJson(person.toJson())
    expect(person).toEqual(expected)
  })

  it('works with JSON', (): void => {
    const person = new PersonNameModel('First', 'Middle', 'Last')

    const expected = PersonNameModel.fromJson(person.toJson())
    expect(person).toEqual(expected)
  })

  it('works with JSON having spaces and apostrophes', (): void => {
    const person = new PersonNameModel('O\'First', 'O\'Middle', 'von O\'Last')

    const expected = PersonNameModel.fromJson(person.toJson())
    expect(person).toEqual(expected)
  })
})
