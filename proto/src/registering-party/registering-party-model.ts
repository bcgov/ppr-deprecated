import { useUsers } from '../users/users'

export interface RegisteringPartyInterface {
  partyCode?: number | undefined;
}

export class RegisteringPartyModel {
  private _partyCode?: number

  public constructor(
    partyCode?: number
  ) {
    this._partyCode = partyCode
  }

  public get partyCode(): number | undefined {
    return this._partyCode
  }

  public toJson(): RegisteringPartyInterface {
    return {
      partyCode: this.partyCode
    }
  }

  public static fromJson(jsonObject: RegisteringPartyInterface): RegisteringPartyModel {
    return new RegisteringPartyModel(jsonObject.partyCode)
  }

}

function getDefs() {

  function createFromCurrentUser() {
    const { currentUser } = useUsers()
    console.log('try to create a RegParty user:', JSON.stringify(currentUser, null, 2))
    const party = currentUser.value.party
    console.log('try to create a RegParty party:', party)
    if(party) {
      return new RegisteringPartyModel(party.code)
    }
  }

  return {
    createFromCurrentUser
  }
}

const instance = {_instance: undefined}
function Instance() {
  return instance._instance || (instance._instance = getDefs())
}

export function useRegisteredParty () {
  return Instance()
}

