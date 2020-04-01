
/**
 * The interface to a business.
 */
export interface BusinessNameInterface {
  businessName?: string;
}

/**
 * The model for a business, such as a registering party, secured party, debtor
 */
export class BusinessNameModel {
  private _businessName?: string

  /**
   * Creates a new Business model instance.
   *
   * @param businessName the name of the business.
   */
  public constructor(businessName?: string) {
    this._businessName = businessName
  }

  /**
   * Gets the name of the business.
   */
  public get businessName(): string | undefined {
    return this._businessName
  }


  /**
   * Gets the JSON representation of the BusinessNameModel object.
   */
  public toJson(): BusinessNameInterface {
    let rval: BusinessNameInterface = {}

    if (this.businessName) {
      rval = Object.assign(rval, { businessName: this.businessName })
    }

    return rval
  }

  /*
   * Class declarations
   */

  /**
   * Gets a BusinessNameModel object from a JSON object.
   *
   * @param jsonObject the JSON version of the object.
   */
  public static fromJson(jsonObject?: BusinessNameInterface): BusinessNameModel | undefined {
    let businessNameModel: BusinessNameModel | undefined

    if (jsonObject) {
      businessNameModel = new BusinessNameModel(jsonObject.businessName)
    }

    return businessNameModel
  }
}
