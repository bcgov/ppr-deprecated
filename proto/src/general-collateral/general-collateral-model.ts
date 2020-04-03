
export interface GeneralCollateralInterface {
  description?: string;
}

export class GeneralCollateralModel {
  /**
   * Provide a publicly accessible property that lists can use to index parties
   */
  public listId: number = 0

  readonly _description?: string;

  public constructor(
    description?: string,
  ) {
    this._description = description
  }

  public get description() {
    return this._description
  }

  public toJson(): GeneralCollateralInterface {
    return {
      description: this.description,
    }
  }

  public static fromJson(jsonObject: GeneralCollateralInterface | undefined): GeneralCollateralModel {
    return new GeneralCollateralModel(
      jsonObject.description,
    )
  }
}
