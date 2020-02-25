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
})
