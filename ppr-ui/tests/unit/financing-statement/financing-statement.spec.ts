import { BasePartyModel } from '@/base-party/base-party-model'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { PersonNameModel } from '@/components/person-name-model'


describe('FinancingStatementModel', (): void => {

  describe('FinancingStatementModel.isValidYears', (): void => {
    function test(input: string, expected: boolean): void {
      const isValid = FinancingStatementModel.isValidYears(input)
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
      const testPerson = new PersonNameModel()

      expect(fstmt.type).toEqual(FinancingStatementType.SECURITY_AGREEMENT)
      expect(fstmt.years).toEqual(1)
      expect(fstmt.registeringParty.first).toEqual(testPerson.first)
      expect(fstmt.registeringParty.middle).toEqual(testPerson.middle)
      expect(fstmt.registeringParty.last).toEqual(testPerson.last)
    })

    it('construct with life', (): void => {
      const fstmt = new FinancingStatementModel(undefined, 2)
      const testPerson = new PersonNameModel()

      expect(fstmt.type).toEqual(FinancingStatementType.SECURITY_AGREEMENT)
      expect(fstmt.years).toEqual(2)
      expect(fstmt.registeringParty.first).toEqual(testPerson.first)
      expect(fstmt.registeringParty.middle).toEqual(testPerson.middle)
      expect(fstmt.registeringParty.last).toEqual(testPerson.last)
    })

    it('construct with type', (): void => {
      const fstmt = new FinancingStatementModel(FinancingStatementType.REPAIRERS_LIEN)
      const testPerson = new PersonNameModel()

      expect(fstmt.type).toEqual(FinancingStatementType.REPAIRERS_LIEN)
      expect(fstmt.years).toEqual(1)
      expect(fstmt.registeringParty.first).toEqual(testPerson.first)
      expect(fstmt.registeringParty.middle).toEqual(testPerson.middle)
      expect(fstmt.registeringParty.last).toEqual(testPerson.last)
    })

    it('construct with person', (): void => {
      const testPerson = new PersonNameModel('First', 'Middle', 'Last')
      const fstmt = new FinancingStatementModel(undefined, undefined, testPerson)

      expect(fstmt.type).toEqual(FinancingStatementType.SECURITY_AGREEMENT)
      expect(fstmt.years).toEqual(1)
      expect(fstmt.registeringParty.first).toEqual(testPerson.first)
      expect(fstmt.registeringParty.middle).toEqual(testPerson.middle)
      expect(fstmt.registeringParty.last).toEqual(testPerson.last)
    })

    it('construct with secured parties', (): void => {
      const testPerson = new PersonNameModel('First', 'Middle', 'Last')
      const testBaseParty = new BasePartyModel(undefined, testPerson)
      const securedParties = [testBaseParty]
      const fstmt = new FinancingStatementModel(undefined, undefined, undefined, securedParties)

      expect(fstmt.securedParties).toBeDefined()
      expect(fstmt.securedParties.length).toBe(1)
      expect(fstmt.securedParties[0].personName.first).toEqual(testPerson.first)
    })


    it('construct with base registration number', (): void => {
      const fstmt = new FinancingStatementModel(undefined, undefined, undefined, undefined, undefined, '123456A')

      expect(fstmt.baseRegistrationNumber).toEqual('123456A')
    })

    it('construct with registration date and time', (): void => {
      const fstmt = new FinancingStatementModel(undefined, undefined, undefined, undefined, undefined, undefined, '2020-01-01T01:01:01')

      expect(fstmt.registrationDateTime).toEqual('2020-01-01T01:01:01')
    })

    it('construct with expiry date', (): void => {
      const fstmt = new FinancingStatementModel(undefined, undefined, undefined, undefined, undefined, undefined, undefined, '2030-01-01')

      expect(fstmt.expiryDate).toEqual('2030-01-01')
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
      const testPerson = new PersonNameModel('First', 'Middle', 'Last')
      const fstmt = new FinancingStatementModel(undefined, undefined, testPerson)
      const fstmtReceived = FinancingStatementModel.fromJson(fstmt.toJson())

      expect(fstmtReceived).toEqual(fstmt)
    })

    // Secured Parties
    it('json with secured parties', (): void => {
      const testPerson = new PersonNameModel('First', 'Middle', 'Last')
      const testBaseParty = new BasePartyModel(undefined, testPerson)
      const securedParties = [testBaseParty]
      const fstmt = new FinancingStatementModel(undefined, undefined, undefined, securedParties)
      const fstmtReceived = FinancingStatementModel.fromJson(fstmt.toJson())

      expect(fstmtReceived).toEqual(fstmt)
    })

  })
})
