/**
 * The interface to an address.
 */
export interface BaseAddressInterface {
  city?: string | undefined;
  country?: string | undefined;
  deliveryInstructions?: string | undefined;
  postalCode?: string | undefined;
  region?: string | undefined;
  street?: string | undefined;
  streetAdditional?: string | undefined;
}

/**
 * The model for an address.
 */
export class BaseAddressModel {
  private _addressCity: string | undefined
  private _addressCountry: string | undefined
  private _addressRegion: string | undefined
  private _deliveryInstructions: string | undefined
  private _postalCode: string | undefined
  private _streetAddress: string | undefined
  private _streetAddressAdditional: string | undefined

  /**
   * Creates a new BaseAddress model instance.
   *
   * @param streetAddress the street address (i.e. address line 1) for the address.
   * @param streetAddressAdditional the additional street address (i.e. address line 2) for the address.
   * @param addressCity the city for the address. 
   * @param addressRegion the region (province / state / etc) for the address.
   * @param postalCode the postal code (or zip code, etc) for the address.
   * @param addressCountry the country for the address.
   * @param deliveryInstructions the delivery instructions (e.g. "leave at back door") for the address.
   */
  public constructor(streetAddress?: string, streetAddressAdditional?: string, addressCity?: string,
    addressRegion?: string, postalCode?: string, addressCountry?: string, deliveryInstructions?: string) {
    this._streetAddress = streetAddress
    this._streetAddressAdditional = streetAddressAdditional
    this._addressCity = addressCity
    this._addressRegion = addressRegion
    this._postalCode = postalCode
    this._addressCountry = addressCountry
    this._deliveryInstructions = deliveryInstructions
  }

  /**
   * Gets the city for the address.
   */
  public get addressCity(): string | undefined {
    return this._addressCity
  }

  /**
   * Gets the country for the address.
   */
  public get addressCountry(): string | undefined {
    return this._addressCountry
  }

  /**
   * Gets the region (province / state / etc) for the address.
   */
  public get addressRegion(): string | undefined {
    return this._addressRegion
  }

  /**
   * Gets the delivery instructions (e.g. "leave at back door") for the address.
   */
  public get deliveryInstructions(): string | undefined {
    return this._deliveryInstructions
  }

  /**
   * Gets the postal code (or zip code, etc) for the address.
   */
  public get postalCode(): string | undefined {
    return this._postalCode
  }

  /**
   * Gets the street address (i.e. address line 1) for the address.
   */
  public get streetAddress(): string | undefined {
    return this._streetAddress
  }

  /**
   * Gets the additional street address (i.e. address line 2) for the address.
   */
  public get streetAddressAdditional(): string | undefined {
    return this._streetAddressAdditional
  }

  /**
   * Gets the JSON representation of the BaseAddressModel object.
   */
  public toJson(): BaseAddressInterface {
    return {
      street: this.streetAddress,
      streetAdditional: this.streetAddressAdditional,
      city: this.addressCity,
      region: this.addressRegion,
      postalCode: this.postalCode,
      country: this.addressCountry,
      deliveryInstructions: this.deliveryInstructions
    }
  }

  /*
   * Class declarations
   */

  /**
   * Gets a BaseAddressModel object from a JSON object.
   *
   * @param jsonObject the JSON version of the object.
   */
  public static fromJson(jsonObject: BaseAddressInterface | undefined): BaseAddressModel | undefined {
    let addressModel: BaseAddressModel | undefined

    if (jsonObject) {
      addressModel = new BaseAddressModel(
        jsonObject.street,
        jsonObject.streetAdditional,
        jsonObject.city,
        jsonObject.region,
        jsonObject.postalCode,
        jsonObject.country,
        jsonObject.deliveryInstructions
      )
    }

    return addressModel
  }
}
