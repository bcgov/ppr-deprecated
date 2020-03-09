
/**
 * The interface to a business.
 */
export interface BusinessInterface {
  businessName: string | undefined;
}

/**
 * The model for a business, such as a registering party, secured party, debtor
 */
export class BusinessModel {
  private _businessName: string | undefined

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
   * Gets the JSON representation of the BusinessModel object.
   */
  public toJson(): BusinessInterface {
    return {
      businessName: this._businessName
    }
  }

  /*
   * Class declarations
   */

  /**
   * Gets a BusinessModel object from a JSON object.
   *
   * @param jsonObject the JSON version of the object.
   */
  public static fromJson(jsonObject: BusinessInterface): BusinessModel {
    return new BusinessModel(jsonObject.businessName)
  }
}
