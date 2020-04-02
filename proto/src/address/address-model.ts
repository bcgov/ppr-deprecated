export interface AddressInterface {
  street?: string;
  city?: string;
  province?: string;
  postal?: string;
  country?: string;
}

export class AddressModel {
  readonly _street?: string
  readonly _city?: string
  readonly _province?: string
  readonly _postal?: string
  readonly _country?: string

  public constructor(
    street?: string,
    city?: string,
    province?: string,
    postal?: string,
    country?: string
  ) {
    this._street = street || ''
    this._city = city || ''
    this._province = province || ''
    this._postal = postal || ''
    this._country = country || ''
  }

  public get street() {
    return this._street
  }

  public get city() {
    return this._city
  }

  public get province() {
    return this._province
  }

  public get postal() {
    return this._postal
  }

  public get country() {
    return this._country
  }

  public toJson(): AddressInterface {
    return {
      street: this._street,
      city: this._city,
      province: this._province,
      postal: this._postal,
      country: this._country,
    }
  }

  public static fromJson(jsonObject: AddressInterface | undefined): AddressModel {
    return new AddressModel(
      jsonObject.street,
      jsonObject.city,
      jsonObject.province,
      jsonObject.postal,
      jsonObject.country
    )
  }
}
