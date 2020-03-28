
import { BusinessNameInterface, BusinessNameModel } from '@/components/business-name-model'
import { PersonNameInterface, PersonNameModel } from '@/components/person-name-model'

/**
 * The interface to a party that may be a person or a business.
 */
export interface BasePartyInterface extends PersonNameInterface, BusinessNameInterface {
}

/**
 * The model for a that may be a person or a business, such as for a registering party.
 */
export class BasePartyModel {

  private _businessName: BusinessNameModel
  private _personName: PersonNameModel

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
  public constructor(
    businessName: BusinessNameModel = new BusinessNameModel(),
    personName: PersonNameModel = new PersonNameModel()
  ) {
    this._businessName = businessName
    this._personName = personName
  }

  /**
   * Gets the business name of the party
   */
  public get businessName(): BusinessNameModel {
    return this._businessName
  }

  /**
   * Gets the person name of the party
   */
  public get personName(): PersonNameModel {
    return this._personName
  }

  /**
   * Gets the JSON representation of the BasePartyModel object.
   */
  public toJson(): BasePartyInterface {
    let rval = {}
    if (this.businessName.businessName) {
      let bm = this.businessName.toJson()
      rval = Object.assign(rval, bm)
    }
    if (this.personName.first || this.personName.last) {
      let pm = this.personName.toJson()
      rval = Object.assign(rval, pm)
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
  public static fromJson(jsonObject: BasePartyInterface | undefined): BasePartyModel {
    let businessName: BusinessNameModel | undefined
    let personName: PersonNameModel | undefined

    if (jsonObject && jsonObject.businessName) {
      businessName = new BusinessNameModel(jsonObject.businessName)
    }

    if (jsonObject && jsonObject.personName) {
      const jp = jsonObject.personName
      personName = new PersonNameModel(jp.first, jp.middle, jp.last)
    }

    return new BasePartyModel(businessName, personName)
  }
}
