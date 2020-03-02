import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { PersonModel } from '@/components/person-model'

describe('FinancingStatementModel', (): void => {

  describe('FinancingStatementModel.isValidLife', (): void => {
    function test(input: string, expected: boolean): void {
      const isValid = FinancingStatementModel.isValidLife(input)
      expect(isValid).toBe(expected)
    }

    it('life of 1 year', (): void => {
      test('1', true)
    })

    it('life of 25 year', (): void => {
      test('25', true)
    })

    it('life of 0 is not valid', (): void => {
      test('0', false)
    })

    it('life of 26 is not valid', (): void => {
      test('26', false)
    })

    it('life of empty is not valid', (): void => {
      test('', false)
    })

    it('life of not a number input ("2b") is not valid', (): void => {
      test('2b', false)
    })

    it('life PI is not valid', (): void => {
      test('3.14159', false)
    })


  })

  describe('construction', (): void => {
    it('empty constructor defaults', (): void => {
      const fstmt = new FinancingStatementModel()
      const testPerson = new PersonModel()

      expect(fstmt.type).toEqual(FinancingStatementType.SECURITY_AGREEMENT)
      expect(fstmt.life).toEqual(1)
      expect(fstmt.registeringParty.firstName).toEqual(testPerson.firstName)
      expect(fstmt.registeringParty.middleName).toEqual(testPerson.middleName)
      expect(fstmt.registeringParty.lastName).toEqual(testPerson.lastName)
    })

    it('construct with life', (): void => {
      const fstmt = new FinancingStatementModel(undefined, 2)
      const testPerson = new PersonModel()

      expect(fstmt.type).toEqual(FinancingStatementType.SECURITY_AGREEMENT)
      expect(fstmt.life).toEqual(2)
      expect(fstmt.registeringParty.firstName).toEqual(testPerson.firstName)
      expect(fstmt.registeringParty.middleName).toEqual(testPerson.middleName)
      expect(fstmt.registeringParty.lastName).toEqual(testPerson.lastName)
    })

    it('construct with type', (): void => {
      const fstmt = new FinancingStatementModel(FinancingStatementType.REPAIRERS_LIEN)
      const testPerson = new PersonModel()

      expect(fstmt.type).toEqual(FinancingStatementType.REPAIRERS_LIEN)
      expect(fstmt.life).toEqual(1)
      expect(fstmt.registeringParty.firstName).toEqual(testPerson.firstName)
      expect(fstmt.registeringParty.middleName).toEqual(testPerson.middleName)
      expect(fstmt.registeringParty.lastName).toEqual(testPerson.lastName)
    })

    it('construct with person', (): void => {
      const testPerson = new PersonModel('First', 'Middle', 'Last')
      const fstmt = new FinancingStatementModel(undefined, undefined, testPerson)

      expect(fstmt.type).toEqual(FinancingStatementType.SECURITY_AGREEMENT)
      expect(fstmt.life).toEqual(1)
      expect(fstmt.registeringParty.firstName).toEqual(testPerson.firstName)
      expect(fstmt.registeringParty.middleName).toEqual(testPerson.middleName)
      expect(fstmt.registeringParty.lastName).toEqual(testPerson.lastName)
    })
  })

  describe('json', (): void => {
    it('json - empty constructor defaults', (): void => {
      const fstmt = new FinancingStatementModel()
      const fstmtReceived = FinancingStatementModel.fromJson(fstmt.toJson())

      expect(fstmtReceived).toEqual(fstmt)
    })

    it('json with life', (): void => {
      const fstmt = new FinancingStatementModel(undefined, 2)
      const fstmtReceived = FinancingStatementModel.fromJson(fstmt.toJson())

      expect(fstmtReceived).toEqual(fstmt)
    })

    it('json with type', (): void => {
      const fstmt = new FinancingStatementModel(FinancingStatementType.REPAIRERS_LIEN)
      const fstmtReceived = FinancingStatementModel.fromJson(fstmt.toJson())

      expect(fstmtReceived).toEqual(fstmt)
    })

    it('json with person', (): void => {
      const testPerson = new PersonModel('First', 'Middle', 'Last')
      const fstmt = new FinancingStatementModel(undefined, undefined, testPerson)
      const fstmtReceived = FinancingStatementModel.fromJson(fstmt.toJson())

      expect(fstmtReceived).toEqual(fstmt)
    })
  })
})
