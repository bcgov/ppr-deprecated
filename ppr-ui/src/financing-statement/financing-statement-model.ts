import { PersonNameInterface, PersonNameModel } from '@/components/person-name-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { BasePartyInterface, BasePartyModel } from '@/base-party/base-party-model'

/**
 * The interface to a financing statement.
 */
export interface FinancingStatementInterface {
  baseRegistrationNumber: string | undefined;
  expiryDate: string | undefined;
  generalCollateral: [];
  registeringParty: { personName: PersonNameInterface };
  registrationDateTime: string | undefined;
  securedParties: BasePartyInterface[];
  debtors: BasePartyInterface[];
  type: FinancingStatementType;
  vehicleCollateral: [];
  lifeYears: number;
}

export class FinancingStatementModel {
  private _baseRegistrationNumber: string | undefined
  private _expiryDate: string | undefined
  private _registeringParty: PersonNameModel
  private _registrationDateTime: string | undefined
  private _type: FinancingStatementType
  private _years: number
  private _securedParties: BasePartyModel[]
  private _debtorParties: BasePartyModel[]

  /**
   * Creates a new FinancingStatementModel model instance.
   *
   * @param type the type of financing statement. A value from the FinancingStatementType enum
   * @param years the number of years the financing statement is registered for. A value between 1 and 25.
   * @param registeringParty the party who registered the financing statement
   * @param securedParties the list of secured parties who own the lien
   * @param debtorParties the list of debtors who own the lien
   * @param baseRegistrationNumber the unique registration number for the financing statement, may be undefined.
   * @param registrationDateTime the date and time that the financing statement was registered.
   * @param expiryDate the expiry date of the financing statement.
   */
  public constructor(
    type: FinancingStatementType = FinancingStatementType.SECURITY_AGREEMENT,
    years: number = 1,
    registeringParty: PersonNameModel = new PersonNameModel(),
    securedParties: BasePartyModel[] = [new BasePartyModel()],
    debtorParties: BasePartyModel[] = [new BasePartyModel()],
    baseRegistrationNumber?: string,
    registrationDatetime?: string,
    expiryDate?: string
  ) {
    this._type = type
    this._years = years
    this._registeringParty = registeringParty
    this._securedParties = securedParties
    this._debtorParties = debtorParties
    this._baseRegistrationNumber = baseRegistrationNumber
    this._registrationDateTime = registrationDatetime
    this._expiryDate = expiryDate
  }

  /**
   * Gets the unique registration number for the financing statement.
   */
  public get baseRegistrationNumber(): string | undefined {
    return this._baseRegistrationNumber
  }

  /**
   * Gets the expiry date of the financing statement.
   */
  public get expiryDate(): string | undefined {
    return this._expiryDate
  }

  /**
   * Gets the list of secured parties who own the lien
   */
  public get securedParties(): BasePartyModel[] {
    return this._securedParties
  }

  /**
 * Gets the list of debtors who own the collateral
 */
  public get debtorParties(): BasePartyModel[] {
    return this._debtorParties
  }

  /**
   * Gets the Person who registered the financing statement
   */
  public get registeringParty(): PersonNameModel {
    return this._registeringParty
  }

  /**
   * Gets the date and time that the financing statement was registered.
   */
  public get registrationDateTime(): string | undefined {
    return this._registrationDateTime
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
  public get years(): number {
    return this._years
  }

  /**
   * Gets the JSON representation of the FinancingStatementModel object.
   */
  public toJson(): FinancingStatementInterface {
    const theSPs: BasePartyInterface[] = []
    this.securedParties.forEach((sp: BasePartyModel): void => {
      theSPs.push(sp.toJson())
    })
    const theDbers: BasePartyInterface[] = []
    this.debtorParties.forEach((sp: BasePartyModel): void => {
      theDbers.push(sp.toJson())
    })
    const rval: FinancingStatementInterface = {
      baseRegistrationNumber: this.baseRegistrationNumber,
      expiryDate: this.expiryDate,
      generalCollateral: [],
      registeringParty: { personName: this.registeringParty.toJson() },
      registrationDateTime: this.registrationDateTime,
      securedParties: theSPs,
      debtors: theDbers,
      type: this.type,
      vehicleCollateral: [],
      lifeYears: this.years
    }
    return rval
  }

  /*
   * Class declarations
   */

  /**
   * Helper function to validate the life of a financing statement given a string value from an input field.
   *
   * @param value string from a form input
   */
  public static isValidYears(value: string): string | boolean {
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
    let registeringParty: PersonNameModel | undefined
    let securedParties: BasePartyModel[] = []
    let debtorParties: BasePartyModel[] = []

    if (jsonObject.registeringParty) {
      registeringParty = PersonNameModel.fromJson(jsonObject.registeringParty.personName)
    }

    if (jsonObject.securedParties) {
      jsonObject.securedParties.forEach((sp: BasePartyInterface): void => {
        const model = BasePartyModel.fromJson(sp)
        if (model) {
          securedParties.push(model)
        }
      })
    }

    if (jsonObject.debtors) {
      jsonObject.debtors.forEach((sp: BasePartyInterface): void => {
        const model = BasePartyModel.fromJson(sp)
        if (model) {
          debtorParties.push(model)
        }
      })
    }

    return new FinancingStatementModel(
      jsonObject.type,
      jsonObject.lifeYears,
      registeringParty,
      securedParties.length > 0 ? securedParties : undefined,
      debtorParties.length > 0 ? debtorParties : undefined,
      jsonObject.baseRegistrationNumber,
      jsonObject.registrationDateTime,
      jsonObject.expiryDate
    )
  }
}
