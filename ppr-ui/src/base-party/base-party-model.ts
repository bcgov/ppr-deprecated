
import { BusinessInterface, BusinessModel } from '@/components/business-model'
import { PersonNameInterface, PersonNameModel } from '@/components/person-name-model'

/**
 * The interface to a party name.
 */
export interface BasePartyInterface {
  personName: PersonNameInterface;
  businessName: BusinessInterface;
}

/**
 * The model for a party name, such as for a registering party.
 */
export class BasePartyModel {

  private _businessName: BusinessModel
  private _personName: PersonNameModel

  /**
   * Creates a new Base Party model instance.
   *
   * @param businessName the business name of the party.
   * @param personName the person name of the party.
   */
  public constructor(
    businessName: BusinessModel = new BusinessModel(),
    personName: PersonNameModel = new PersonNameModel()
  ) {
    this._businessName = businessName
    this._personName = personName
  }

  public get businessName(): BusinessModel {
    return this._businessName
  }

  public get personName(): PersonNameModel {
    return this._personName
  }

  /**
   * Gets the JSON representation of the BasePartyModel object.
   */
  public toJson(): BasePartyInterface {
    return {
      businessName: this.businessName.toJson(),
      personName: this.personName.toJson()
    }
  }

  /*
–   * Class declarations
   */

  /**
   * Gets a BasePartyModel object from a JSON string.
   *
   * @param jsonObject the JSON version of the object.
   */
  public static fromJson(jsonObject: BasePartyInterface): BasePartyModel {
    let businessName: BusinessModel | undefined
    let personName: PersonNameModel | undefined

    if (jsonObject.businessName) {
      businessName = BusinessModel.fromJson(jsonObject.businessName)
    }

    if (jsonObject.personName) {
      personName = PersonNameModel.fromJson(jsonObject.personName)
    }

    return new BasePartyModel(businessName, personName)
  }
}
