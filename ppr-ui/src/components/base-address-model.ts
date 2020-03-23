/**
 * The interface to an address.
 */
export interface BaseAddressInterface {
  city?: string;
  country?: string;
  postalCode?: string;
  region?: string;
  street?: string;
  streetAdditional?: string;
}

/**
 * The interface to an address from the legacy component.
 */
export interface LegacyBaseAddressInterface {
  addressCity?: string;
  addressCountry?: string;
  addressRegion?: string;
  postalCode?: string;
  streetAddress?: string;
  streetAddressAdditional?: string;
}

/**
 * The model for an address.
 */
export class BaseAddressModel {
  private _city: string | undefined
  private _country: string | undefined
  private _postalCode: string | undefined
  private _region: string | undefined
  private _street: string | undefined
  private _streetAdditional: string | undefined

  /**
   * Creates a new BaseAddress model instance.
   *
   * @param street the street address (i.e. address line 1) for the address.
   * @param streetAdditional the additional street address (i.e. address line 2) for the address.
   * @param city the city for the address. 
   * @param region the region (province / state / etc) for the address.
   * @param postalCode the postal code (or zip code, etc) for the address.
   * @param country the country for the address.
   */
  public constructor(street?: string, streetAdditional?: string, city?: string, region?: string, postalCode?: string,
    country?: string) {
    this._street = street
    this._streetAdditional = streetAdditional
    this._city = city
    this._region = region
    this._postalCode = postalCode
    this._country = country
  }

  /**
   * Gets the city for the address.
   */
  public get city(): string | undefined {
    return this._city
  }

  /**
   * Gets the country for the address.
   */
  public get country(): string | undefined {
    return this._country
  }

  /**
   * Gets the region (province / state / etc) for the address.
   */
  public get region(): string | undefined {
    return this._region
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
  public get street(): string | undefined {
    return this._street
  }

  /**
   * Gets the additional street address (i.e. address line 2) for the address.
   */
  public get streetAdditional(): string | undefined {
    return this._streetAdditional
  }

  /**
   * Gets the JSON representation of the BaseAddressModel object.
   */
  public toJson(): BaseAddressInterface {
    return {
      street: this.street,
      streetAdditional: this.streetAdditional,
      city: this.city,
      region: this.region,
      postalCode: this.postalCode,
      country: this.country
    }
  }

  /**
   * Gets the JSON representation of the BaseAddressModel object, in the legacy component format.
   */
  public toLegacyJson(): LegacyBaseAddressInterface {
    return {
      streetAddress: this.street,
      streetAddressAdditional: this.streetAdditional,
      addressCity: this.city,
      addressRegion: this.region,
      postalCode: this.postalCode,
      addressCountry: this.country
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
        jsonObject.country
      )
    }

    return addressModel
  }

  /**
   * Gets a BaseAddressModel object from a JSON object in the legacy component format.
   *
   * @param jsonObject the JSON version of the object, in the legacy component format.
   */
  public static fromLegacyJson(jsonObject: LegacyBaseAddressInterface | undefined): BaseAddressModel | undefined {
    let addressModel: BaseAddressModel | undefined

    if (jsonObject) {
      addressModel = new BaseAddressModel(
        jsonObject.streetAddress,
        jsonObject.streetAddressAdditional,
        jsonObject.addressCity,
        jsonObject.addressRegion,
        jsonObject.postalCode,
        jsonObject.addressCountry
      )
    }

    return addressModel
  }
}
