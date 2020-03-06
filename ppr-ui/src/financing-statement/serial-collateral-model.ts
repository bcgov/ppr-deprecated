import { SerialCollateralType } from '@/financing-statement/serial-collateral-type'

/**
 * The interface to a piece of collateral that is identified by a serial number.
 */
export interface SerialCollateralInterface {
  baseRegistrationNumber: string | undefined;
  make: string | undefined;
  manufacturedHomeRegNumber: string | undefined;
  model: string | undefined;
  serial: string | undefined;
  type: SerialCollateralType | undefined;
  year: number | undefined;
}

export class SerialCollateralModel {
  private _baseRegistrationNumber: string | undefined
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
   * @param baseRegistrationNumber the registration number of the financing statement that the collateral belongs to.
   */
  public constructor(
    type?: SerialCollateralType | undefined,
    make?: string | undefined,
    model?: string | undefined,
    serial?: string | undefined,
    manufacturedHomeRegNumber?: string | undefined,
    year?: number | undefined,
    baseRegistrationNumber?: string | undefined
  ) {
    this._baseRegistrationNumber = baseRegistrationNumber
    this._type = type
    this._make = make
    this._model = model
    this._serial = serial
    this._manufacturedHomeRegNumber = manufacturedHomeRegNumber
    this._year = year
  }

  /**
   * Gets the registration number of the financing statement that the collateral belongs to.
   */
  public get baseRegistrationNumber(): string | undefined {
    return this._baseRegistrationNumber
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
   * Gets the JSON representation of the SerialCollateralModel object.
   */
  public toJson(): SerialCollateralInterface {
    return {
      baseRegistrationNumber: this.baseRegistrationNumber,
      make: this.make,
      manufacturedHomeRegNumber: this.type == SerialCollateralType.MANUFACTURED_HOME ?
        this.manufacturedHomeRegNumber : undefined,
      model: this.model,
      serial: this.serial,
      type: this.type,
      year: this.year
    }
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
      jsonObject.year,
      jsonObject.baseRegistrationNumber
    )
  }
}
