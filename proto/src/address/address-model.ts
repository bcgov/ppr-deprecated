export interface AddressInterface {
      street?: string,
      city?: string,
      province?: string,
      postal?: string,
      country?: string
}

export class AddressModel {
  public street?: string
  public city?: string
  public province?: string
  public postal?: string
  public country?: string

  public toJson(): AddressInterface {
    const rval = {
      street: this.street,
      city: this.city,
      province: this.province,
      postal: this.postal,
      country: this.country,
    }
    return rval
  }

  public static fromJson(jsonObject: AddressInterface | undefined): AddressModel {
    const rval = new AddressModel()
    rval.street = jsonObject.street
    rval.city = jsonObject.city
    rval.province = jsonObject.province
    rval.postal = jsonObject.postal
    rval.country = jsonObject.country
    return rval
  }
}
