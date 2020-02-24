import Person from '@/components/person'

describe('Person', (): void => {
  it('has empty first name when set to be empty', (): void => {
    const person = new Person('', 'Middle', 'Last')

    expect(person.firstName).toEqual('')
  })

  it('has first name when set', (): void => {
    const person = new Person('First', 'Middle', 'Last')

    expect(person.firstName).toEqual('First')
  })

  it('has new first name when set', (): void => {
    const person = new Person('First', 'Middle', 'Last')
    person.firstName = 'Newfirst'

    expect(person.firstName).toEqual('Newfirst')
  })

  it('has empty middle name when set to be empty', (): void => {
    const person = new Person('First', '', 'Last')

    expect(person.middleName).toEqual('')
  })

  it('has middle name when set', (): void => {
    const person = new Person('First', 'Middle', 'Last')

    expect(person.middleName).toEqual('Middle')
  })

  it('has new middle name when set', (): void => {
    const person = new Person('First', 'Middle', 'Last')
    person.middleName = 'Newmiddle'

    expect(person.middleName).toEqual('Newmiddle')
  })

  it('has empty last name when set to be empty', (): void => {
    const person = new Person('First', 'Middle', '')

    expect(person.lastName).toEqual('')
  })

  it('has last name when set', (): void => {
    const person = new Person('First', 'Middle', 'Last')

    expect(person.lastName).toEqual('Last')
  })

  it('has new last name when set', (): void => {
    const person = new Person('First', 'Middle', 'Last')
    person.lastName = 'Newlast'

    expect(person.lastName).toEqual('Newlast')
  })
})
