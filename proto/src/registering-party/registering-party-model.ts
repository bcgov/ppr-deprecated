import { useUsers } from '../users/users'

export interface RegisteringPartyInterface {
  clientCode?: string | undefined;
}

export class RegisteringPartyModel {
  private _clientCode?: string

  public constructor(
    clientCode?: string
  ) {
    this._clientCode = clientCode
  }

  public get clientCode(): string | undefined {
    return this._clientCode
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

function getDefs():object {

  function createFromCurrentUser() {
    const { currentUser } = useUsers()
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
function Instance():object {
  return instance._instance || (instance._instance = getDefs())
}

export function useRegisteredParty ():object {
  return Instance()
}

