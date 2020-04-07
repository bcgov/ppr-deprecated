import { SerialCollateralType } from '@/serial-collateral/serial-collateral-type'

/**
 * The interface to a piece of collateral that is identified by a serial number.
 */
export interface SerialCollateralInterface {
  make: string | undefined;
  manufacturedHomeRegNumber: string | undefined;
  model: string | undefined;
  serial: string | undefined;
  type: SerialCollateralType | undefined;
  year: number | undefined;
}

export class SerialCollateralModel {
  /**
   * Provide a publicly accessible property that lists can use to index parties
   */
  public listId: number = 0

  private _make: string | undefined
  private _model: string | undefined
  private _serial: string | undefined
  private _manufacturedHomeRegNumber: string | undefined
  private _type: SerialCollateralType | undefined
  private _year: number | undefined

  /**
   * Creates a new SerialCollateral model instance.
   *
   * @param type the type of serial collateral. This is a value from the SerialCollateralType enumeration.
   * @param make the make (manufacturer) of the collateral item.
   * @param model the model of the collateral item.
   * @param serial the serial (number) of the collateral item.
   * @param manufacturedHomeRegNumber the manufactured home registration number of the collateral item.
   * @param year the year that the collateral item was built.
   */
  public constructor(
    type?: SerialCollateralType | undefined,
    make?: string | undefined,
    model?: string | undefined,
    serial?: string | undefined,
    manufacturedHomeRegNumber?: string | undefined,
    year?: number | undefined,
  ) {
    this._type = type
    this._make = make
    this._model = model
    this._serial = serial
    this._manufacturedHomeRegNumber = manufacturedHomeRegNumber
    this._year = year
  }

  /**
   * Gets the make (manufacturer) of the collateral item.
   */
  public get make(): string | undefined {
    return this._make
  }

  /**
   * Gets the manufactured home registration number of the collateral item.
   */
  public get manufacturedHomeRegNumber(): string | undefined {
    return this._manufacturedHomeRegNumber
  }

  /**
   * Gets the model of the collateral item.
   */
  public get model(): string | undefined {
    return this._model
  }

  /**
   * Gets the serial (number) of the collateral item.
   */
  public get serial(): string | undefined {
    return this._serial
  }

  /**
   * Gets the type of serial collateral. This is a value from the SerialCollateralType enumeration.
   */
  public get type(): SerialCollateralType | undefined {
    return this._type
  }

  /**
   * Gets the year that the collateral item was built.
   */
  public get year(): number | undefined {
    return this._year
  }

  /**
   * Gets the JSON representation of the SerialCollateralModel object. This will remove fields that are not valid for
   * the given type of collateral.
   */
  public toJson(): SerialCollateralInterface {
    const jsonObject = {
      make: this.make,
      manufacturedHomeRegNumber: this.manufacturedHomeRegNumber,
      model: this.model,
      serial: this.serial,
      type: this.type,
      year: this.year
    }

    // Manufactured homes don't have make, model, or year.
    if (this.type == SerialCollateralType.MANUFACTURED_HOME_NOT_REGISTERED ||
      this.type == SerialCollateralType.MANUFACTURED_HOME_REGISTERED) {
      jsonObject.make = undefined
      jsonObject.model = undefined
      jsonObject.year = undefined
    }

    if (this.type == SerialCollateralType.MANUFACTURED_HOME_REGISTERED) {
      // Registered manufactured homes don't have serial numbers.
      jsonObject.serial = undefined
    } else {
      // All other types don't have manufactured home registration numbers.
      jsonObject.manufacturedHomeRegNumber = undefined
    }

    return jsonObject
  }

  /*
   * Class declarations.
   */

  /**
   * Gets a SerialCollateralModel object from a JSON object.
   *
   * @param jsonObject the JSON version of the object.
   */
  public static fromJson(jsonObject: SerialCollateralInterface): SerialCollateralModel {
    return new SerialCollateralModel(
      jsonObject.type,
      jsonObject.make,
      jsonObject.model,
      jsonObject.serial,
      jsonObject.manufacturedHomeRegNumber,
      jsonObject.year
    )
  }
}
