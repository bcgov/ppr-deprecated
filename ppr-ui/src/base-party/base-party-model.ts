
import { BusinessNameInterface, BusinessNameModel } from '@/components/business-name-model'
import { PersonNameInterface, PersonNameModel } from '@/components/person-name-model'

/**
 * The interface to a party that may be a person or a business.
 */
export interface BasePartyInterface {
  businessName?: BusinessNameInterface['businessName'];
  personName?: PersonNameInterface;
}

/**
 * The model for a that may be a person or a business, such as for a registering party.
 */
export class BasePartyModel {
  private _businessName?: BusinessNameModel
  private _personName?: PersonNameModel

  /**
   * Provide a publicly accessible property that lists can use to index parties
   */
  public listId: number = 0

  /**
   * Creates a new Base Party model instance.
   *
   * @param businessName the business name of the party.
   * @param personName the person name of the party.
   */
  public constructor(businessName?: BusinessNameModel, personName?: PersonNameModel) {
    this._businessName = businessName
    this._personName = personName
  }

  /**
   * Gets the business name of the party
   */
  public get businessName(): BusinessNameModel | undefined {
    return this._businessName
  }

  /**
   * Gets the person name of the party
   */
  public get personName(): PersonNameModel | undefined {
    return this._personName
  }

  /**
   * Gets the JSON representation of the BasePartyModel object.
   */
  public toJson(): BasePartyInterface {
    let rval: BasePartyInterface = {}

    if (this.businessName?.businessName) {
      rval = Object.assign(rval, this.businessName.toJson())
    }

    if (this.personName?.first || this.personName?.last) {
      rval = Object.assign(rval, { personName: this.personName.toJson() })
    }

    return rval
  }

  /*
   * Class declarations
   */

  /**
   * Gets a BasePartyModel object from a JSON string.
   *
   * @param jsonObject the JSON version of the object.
   */
  public static fromJson(jsonObject?: BasePartyInterface): BasePartyModel | undefined {
    let basePartyModel: BasePartyModel | undefined

    if (jsonObject) {
      let businessNameModel: BusinessNameModel | undefined
      if (jsonObject.businessName) {
        businessNameModel = BusinessNameModel.fromJson({ businessName: jsonObject.businessName })
      }

      basePartyModel = new BasePartyModel(businessNameModel, PersonNameModel.fromJson(jsonObject.personName))
    }

    return basePartyModel
  }
}
