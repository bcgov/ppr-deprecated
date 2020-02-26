import { FinancingStatementTypes } from '@/financing-statement/financing-statement-types'
import { PersonModel } from '@/components/person-model'

export default class FinancingStatementModel {

  /*
    Helper function to validate the term of a financing statement given a string value from an input field.
  */
  public static isValidTerm(value: string): string | boolean {
    let isValid = false
    const parsed = Number.parseInt(value)
    if (!Number.isNaN(parsed)) {
      let num = Number(value)
      if (num === parsed) {
        isValid = parsed >= 1 && parsed <= 25
      }
    }
    return isValid
  }

  private _type: FinancingStatementTypes
  private _term: number
  private _registeringParty: PersonModel

  /**
   *
   * @param type the type of financing statement. A value from the FinancingStatementTypes enum
   * @param term the number of years the financing statement is registered for. A value between 1 and 25.
   * @param registeringParty the PersonModel who registered the financing statement
   */
  public constructor(
    type = FinancingStatementTypes.SECURITY_AGREEMENT,
    term = 1,
    registeringParty = new PersonModel()
  ) {
    this._type = type
    this._term = term
    this._registeringParty = registeringParty
  }

  /**
   * Gets the type of financing statement
   */
  public get type(): FinancingStatementTypes {
    return this._type
  }

  /**
   * Gets the number of years the financing statement is registered for.
   */
  public get term(): number {
    return this._term
  }

  /**
   * Gets the Person who registered the financing statement
   */
  public get registeringParty(): PersonModel {
    return this._registeringParty
  }
}
