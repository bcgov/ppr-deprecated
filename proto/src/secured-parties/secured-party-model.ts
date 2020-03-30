
export interface SecuredPartyInterface {
  partyCode?: number | undefined;
}

export class SecuredPartyModel {
  private _partyCode?: number
  /**
   * Provide a publicly accessible property that lists can use to index parties
   */
  public listId: number = 0

  public constructor(
    partyCode?: number
  ) {
    this._partyCode = partyCode
  }

  public get partyCode(): number | undefined {
    return this._partyCode
  }

  public toJson(): SecuredPartyInterface {
    return {
      partyCode: this.partyCode
    }
  }

  public static fromJson(jsonObject: SecuredPartyInterface): SecuredPartyModel {
    return new SecuredPartyModel(jsonObject.partyCode)
  }

}

function getDefs() {

  return {
  }
}

const instance = {_instance: undefined}
function Instance() {
  return instance._instance || (instance._instance = getDefs())
}

export function useSecuredParty () {
  return Instance()
}

