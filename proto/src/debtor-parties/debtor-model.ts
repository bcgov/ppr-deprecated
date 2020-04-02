import { AddressModel, AddressInterface } from '@/address/address-model'

export interface DebtorInterface {
  business?: string;
  first?: string;
  middle?: string;
  last?: string;
  address? : AddressInterface;
  birthDate?: string;
}

export class DebtorModel {
  /**
   * Provide a publicly accessible property that lists can use to index parties
   */
  public listId: number = 0

  readonly _business?: string;
  readonly _first?: string;
  readonly _middle?: string;
  readonly _last?: string;
  readonly _address? : AddressModel
  readonly _birthDate?: string;

  public constructor(
    business?: string,
    first?: string,
    middle?: string,
    last?: string,
    address? : AddressInterface,
    birthDate?: string
  ) {
    this._business = business
    this._first = first
    this._middle = middle
    this._last = last
    this._address = address as AddressModel || new AddressModel()
    this._birthDate = birthDate
  }

  public get business() {
    return this._business
  }
  public get first () {
    return this._first
  }
  public get middle() {
    return this._middle
  }
  public get last() {
    return this._last
  }
  public get address() {
    return this._address
  }
  public get birthDate() {
    return this._birthDate
  }

  public toJson(): DebtorInterface {
    return {
      business: this.business,
      first: this._first,
      middle: this._middle,
      last: this._last,
      address: this._address.toJson(),
      birthDate: this._birthDate
    }
  }

  public static fromJson(jsonObject: DebtorInterface | undefined): DebtorModel {
    let address: AddressModel | undefined
    if(jsonObject.address) {
      address = AddressModel.fromJson(jsonObject.address)
    }
    return new DebtorModel(
      jsonObject.business,
      jsonObject.first,
      jsonObject.middle,
      jsonObject.last,
      address,
      jsonObject.birthDate
    )
  }
}
