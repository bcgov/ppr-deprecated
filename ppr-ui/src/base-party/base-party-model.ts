import { BaseAddressInterface, BaseAddressModel } from '@/components/base-address-model'
import { BusinessNameInterface, BusinessNameModel } from '@/components/business-model'
import { PersonNameInterface, PersonNameModel } from '@/components/person-name-model'

/**
 * The interface to a party that may be a person or a business, with an address.
 */
export interface BasePartyInterface extends PersonNameInterface, BusinessNameInterface {
  address?: BaseAddressInterface;
}

/**
 * The model for a party that may be a person or a business, such as for a registering party.
 */
export class BasePartyModel {

  private _businessName: BusinessNameModel
  private _personName: PersonNameModel
  private _address?: BaseAddressModel

  /**
   * Provide a publicly accessible property that lists can use to index parties
   */
  public listId: number = 0

  /**
   * Creates a new Base Party model instance.
   *
   * @param businessName the business name of the party.
   * @param personName the person name of the party.
   * @param address the address of the party.
   */
  public constructor(
    businessName: BusinessNameModel = new BusinessNameModel(),
    personName: PersonNameModel = new PersonNameModel(),
    address?: BaseAddressModel
  ) {
    this._businessName = businessName
    this._personName = personName
    this._address = address
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
   * Gets the address of the party
   */
  public get address(): BaseAddressModel | undefined {
    return this._address
  }

  /**
   * Gets the JSON representation of the BasePartyModel object.
   */
  public toJson(): BasePartyInterface {
    let rval: BasePartyInterface = {}

    if (this.businessName.businessName) {
      let bm = this.businessName.toJson()
      rval = Object.assign(rval, bm)
    }

    if (this.personName.first || this.personName.last) {
      let pm = this.personName.toJson()
      rval = Object.assign(rval, pm)
    }

    if (this.address) {
      rval = Object.assign(rval, { address: this.address.toJson() })
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
    let address: BaseAddressModel | undefined

    if (jsonObject) {
      if (jsonObject.businessName) {
        businessName = new BusinessNameModel(jsonObject.businessName)
      }

      if (jsonObject.personName) {
        const jp = jsonObject.personName
        personName = new PersonNameModel(jp.first, jp.middle, jp.last)
      }

      address = BaseAddressModel.fromJson(jsonObject.address)
    }

    return new BasePartyModel(businessName, personName, address)
  }
}
