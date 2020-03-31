
export interface SecuredPartyInterface {
  clientCode?: string | undefined;
}

export class SecuredPartyModel {
  private _partyCode?: string
  /**
   * Provide a publicly accessible property that lists can use to index parties
   */
  public listId: number = 0

  public constructor(
    clientCode: string = ''
  ) {
    this._partyCode = clientCode
  }

  public get clientCode(): string | undefined {
    return this._partyCode
  }

  public toJson(): SecuredPartyInterface {
    return {
      clientCode: this.clientCode
    }
  }

  public static fromJson(jsonObject: SecuredPartyInterface): SecuredPartyModel {
    return new SecuredPartyModel(jsonObject.clientCode)
  }

}

