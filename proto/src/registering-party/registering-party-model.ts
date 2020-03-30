import { BasePartyModel, BasePartyInterface } from '@/base-party/base-party-model'
import { BusinessNameModel } from '@/business-name/business-name-model'
import { PersonNameModel } from '@/person-name/person-name-model'
import { usePartyCodes, PartyCodeInterface } from '../party-code/party-code-model'
import { useUsers } from '../users/users'

export interface RegisteringPartyInterface extends BasePartyInterface {
  partyCode?: number | undefined;
}

export class RegisteringPartyModel extends BasePartyModel {
  private _partyCode?: number

  public constructor(
    businessName: BusinessNameModel = new BusinessNameModel(),
    personName: PersonNameModel = new PersonNameModel(),
    partyCode?: number
  ) {
    super(businessName, personName)
    this._partyCode = partyCode
  }

  public get getPartyCode(): number | undefined {
    return this._partyCode
  }

  public toJson(): RegisteringPartyInterface {
    const json: RegisteringPartyInterface = super.toJson()
    json.partyCode = this._partyCode
    return json
  }

  public static fromJson(jsonObject: RegisteringPartyInterface): RegisteringPartyModel {
    let businessName: BusinessNameModel | undefined
    let personName: PersonNameModel | undefined

    if (jsonObject && jsonObject.businessName) {
      businessName = new BusinessNameModel(jsonObject.businessName)
    }

    if (jsonObject && jsonObject.personName) {
      const jp = jsonObject.personName
      personName = new PersonNameModel(jp.first, jp.middle, jp.last)
    }
    return new RegisteringPartyModel(businessName, personName, jsonObject.partyCode)
  }

}

function getDefs() {

  function createFromCurrentUser() {
    const { currentUser } = useUsers()
    console.log('try to create a RegParty user:', JSON.stringify(currentUser, null, 2))
    const party = currentUser.party
    console.log('try to create a RegParty party:', party)
    if(party) {
      const businessName = new BusinessNameModel(party.business)
      const personName = new PersonNameModel(currentUser.name, undefined, currentUser.last)
      return new RegisteringPartyModel(businessName, personName, party.code)
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

