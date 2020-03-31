import { useUsers } from '../users/users'

export interface RegisteringPartyInterface {
  clientCode?: string | undefined;
}

export class RegisteringPartyModel {
  private _partyCode?: string

  public constructor(
    clientCode?: string
  ) {
    this._partyCode = clientCode
  }

  public get clientCode(): string | undefined {
    return this._partyCode
  }

  public toJson(): RegisteringPartyInterface {
    return {
      clientCode: this.clientCode
    }
  }

  public static fromJson(jsonObject: RegisteringPartyInterface): RegisteringPartyModel {
    return new RegisteringPartyModel(jsonObject.clientCode)
  }

}

function getDefs() {

  function createFromCurrentUser() {
    const { currentUser } = useUsers()
    console.log('createFromCurrentUser', currentUser, currentUser.value)
    const party = currentUser.value.party
    if(party) {
      return new RegisteringPartyModel(party.clientCode)
    }
    console.log('Error?  could not find part for user')
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

