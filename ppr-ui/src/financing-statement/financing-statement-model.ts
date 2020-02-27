import { PersonInterface, PersonModel } from '@/components/person-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'

/**
 * The interface to a financing statement.
 */
export interface FinancingStatementInterface {
  securedParties: [];
  debtors: [];
  vehicleCollateral: [];
  generalCollateral: [];
  type: FinancingStatementType;
  years: number;
  registeringParty: PersonInterface;
}

export class FinancingStatementModel {
  private _type: FinancingStatementType
  private _life: number
  private _registeringParty: PersonModel

  /**
   * Creates a new FinancingStatementModel model instance.
   *
   * @param type the type of financing statement. A value from the FinancingStatementType enum
   * @param life the number of years the financing statement is registered for. A value between 1 and 25.
   * @param registeringParty the PersonModel who registered the financing statement
   */
  public constructor(
    type: FinancingStatementType = FinancingStatementType.SECURITY_AGREEMENT,
    life: number = 1,
    registeringParty: PersonModel = new PersonModel()
  ) {
    this._type = type
    this._life = life
    this._registeringParty = registeringParty
  }

  /**
   * Gets the type of financing statement
   */
  public get type(): FinancingStatementType {
    return this._type
  }

  /**
   * Gets the number of years the financing statement is registered for.
   */
  public get life(): number {
    return this._life
  }

  /**
   * Gets the Person who registered the financing statement
   */
  public get registeringParty(): PersonModel {
    return this._registeringParty
  }

  /**
   * Gets the JSON representation of the FinancingStatementModel object.
   */
  public toJson(): FinancingStatementInterface {
    return {
      securedParties: [],
      debtors: [],
      vehicleCollateral: [],
      generalCollateral: [],
      type: this.type,
      years: this.life,
      registeringParty: this.registeringParty.toJson()
    }
  }

  /*
   * Class declarations
   */

  /**
  * Helper function to validate the life of a financing statement given a string value from an input field.
  *
  * @param value string from a form input
  */
  public static isValidLife(value: string): string | boolean {
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

  /**
   * Gets a FinancingStatementModel object from a JSON object.
   * 
   * @param jsonObject the JSON version of the object.
   */
  public static fromJson(jsonObject: FinancingStatementInterface): FinancingStatementModel {
    let registeringParty: PersonModel | undefined

    if (jsonObject.registeringParty) {
      registeringParty = new PersonModel(
        jsonObject.registeringParty.name.first,
        jsonObject.registeringParty.name.middle,
        jsonObject.registeringParty.name.last
      )
    }

    return new FinancingStatementModel(
      jsonObject.type,
      jsonObject.years,
      registeringParty
    )
  }
}
