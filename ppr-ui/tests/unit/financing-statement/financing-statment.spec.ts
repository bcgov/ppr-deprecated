import FinancingStatementModel from '@/financing-statement/financing-statement-model'
import { FinancingStatementTypes, FinancingStatementTypesCodeList } from '@/financing-statement/financing-statement-types'
import { PersonModel } from '@/components/person-model'

describe('FinancingStatementModel', (): void => {

  describe('FinancingStatementModel.isValidTerm', (): void => {
    function test(input, expected): void {
      const isValid = FinancingStatementModel.isValidTerm(input)
      expect(isValid).toBe(expected)
    }

    it('term of 1 year', (): void => {
      test('1', true)
    })

    it('term of 25 year', (): void => {
      test('25', true)
    })

    it('term of 0 is not valid', (): void => {
      test('0', false)
    })

    it('term of 26 is not valid', (): void => {
      test('26', false)
    })

    it('term of empty is not valid', (): void => {
      test('', false)
    })

    it('term of not a number input ("2b") is not valid', (): void => {
      test('2b', false)
    })

  })

  describe('construction', (): void => {
    it('empty constructor defaults', (): void => {
      const fstmt = new FinancingStatementModel()
      const testPerson = new PersonModel()

      expect(fstmt.type).toEqual(FinancingStatementTypes.SECURITY_AGREEMENT)
      expect(fstmt.term).toEqual(1)
      expect(fstmt.registeringParty.firstName).toEqual(testPerson.firstName)
      expect(fstmt.registeringParty.middleName).toEqual(testPerson.middleName)
      expect(fstmt.registeringParty.lastName).toEqual(testPerson.lastName)
    })

    it('construct with term', (): void => {
      const fstmt = new FinancingStatementModel(undefined, 2)
      const testPerson = new PersonModel()

      expect(fstmt.type).toEqual(FinancingStatementTypes.SECURITY_AGREEMENT)
      expect(fstmt.term).toEqual(2)
      expect(fstmt.registeringParty.firstName).toEqual(testPerson.firstName)
      expect(fstmt.registeringParty.middleName).toEqual(testPerson.middleName)
      expect(fstmt.registeringParty.lastName).toEqual(testPerson.lastName)
    })

    it('construct with type', (): void => {
      const fstmt = new FinancingStatementModel(FinancingStatementTypes.REPAIRERS_LIEN)
      const testPerson = new PersonModel()

      expect(fstmt.type).toEqual(FinancingStatementTypes.REPAIRERS_LIEN)
      expect(fstmt.term).toEqual(1)
      expect(fstmt.registeringParty.firstName).toEqual(testPerson.firstName)
      expect(fstmt.registeringParty.middleName).toEqual(testPerson.middleName)
      expect(fstmt.registeringParty.lastName).toEqual(testPerson.lastName)
    })

    it('construct with person', (): void => {
      const testPerson = new PersonModel('First', 'Middle', 'Last')
      const fstmt = new FinancingStatementModel(undefined, undefined, testPerson)

      expect(fstmt.type).toEqual(FinancingStatementTypes.SECURITY_AGREEMENT)
      expect(fstmt.term).toEqual(1)
      expect(fstmt.registeringParty.firstName).toEqual(testPerson.firstName)
      expect(fstmt.registeringParty.middleName).toEqual(testPerson.middleName)
      expect(fstmt.registeringParty.lastName).toEqual(testPerson.lastName)
    })

  })


})
