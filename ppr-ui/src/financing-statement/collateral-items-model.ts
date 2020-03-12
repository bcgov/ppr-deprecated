import { SerialCollateralInterface, SerialCollateralModel } from '@/financing-statement/serial-collateral-model'

/**
 * The interface to a collection of serial number collateral and a description of general collateral.
 */
export interface CollateralItemsInterface {
  serialCollateral: SerialCollateralInterface[] | undefined;
  generalCollateral: string | undefined;
}

/**
 * The model for a collection of serial number collateral and a description of general collateral.
 */
export class CollateralItemsModel implements CollateralItemsInterface {
  private _serialCollateral: SerialCollateralModel[] | undefined
  private _generalCollateral: string | undefined

  /**
   * Creates a new SerialCollateral model instance.
   *
   * @param serialCollateral the collection of serial collateral models.
   * @param generalCollateral the description of the general collateral.
   */
  public constructor(
    serialCollateral?: SerialCollateralModel[] | undefined,
    generalCollateral?: string | undefined
  ) {
    this._serialCollateral = serialCollateral
    this._generalCollateral = generalCollateral
  }

  /**
   * Gets the collection of serial collateral models.
   */
  public get serialCollateral(): SerialCollateralModel[] | undefined {
    return this._serialCollateral
  }

  /**
   * Gets the description of the general collateral.
   */
  public get generalCollateral(): string | undefined {
    return this._generalCollateral
  }

  /**
   * Gets the JSON representation of the CollateralItemsModel object.
   */
  public toJson(): CollateralItemsInterface {
    const serialCollaterals: SerialCollateralInterface[] = []

    if (this.serialCollateral) {
      this.serialCollateral.forEach((serialCollateral: SerialCollateralModel): void => {
        console.log(serialCollateral.make)
        serialCollaterals.push(serialCollateral.toJson())
      })
    }

    return {
      serialCollateral: serialCollaterals.length > 0 ? serialCollaterals : undefined,
      generalCollateral: this.generalCollateral
    }
  }

  /*
   * Class declarations.
   */

  /**
   * Gets a CollateralItemsModel object from a JSON object.
   * 
   * @param jsonObject the JSON version of the object.
   */
  public static fromJson(jsonObject: CollateralItemsInterface): CollateralItemsModel {
    const serialCollaterals: SerialCollateralModel[] = []

    if (jsonObject.serialCollateral) {
      jsonObject.serialCollateral.forEach((serialCollateral: SerialCollateralInterface): void => {
        serialCollaterals.push(SerialCollateralModel.fromJson(serialCollateral))
      })
    }

    return new CollateralItemsModel(
      serialCollaterals.length > 0 ? serialCollaterals : undefined,
      jsonObject.generalCollateral
    )
  }
}
