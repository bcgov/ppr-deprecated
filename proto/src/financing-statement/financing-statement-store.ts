import { computed, ref } from '@vue/composition-api'
import { BasePartyModel } from '@/base-party/base-party-model'
import { FinancingStatementInterface, FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { SecuredPartyModel} from '@/secured-parties/secured-party-model.ts'
import { useRegisteredParty } from '@/registering-party/registering-party-model'

function getDefs() {
  const fsList = ref(FSList())

  function createFinancingStatement(): FinancingStatementModel {
    const { createFromCurrentUser } = useRegisteredParty()
    const firstSecuredParty = new SecuredPartyModel("101")
    firstSecuredParty.listId = 0
    const securedParties = [firstSecuredParty]
    const firstDebtor = new BasePartyModel()
    firstDebtor.listId = 0
    const debtorParties = [firstDebtor]
    const registeringParty = createFromCurrentUser()
    return new FinancingStatementModel(undefined, 5, registeringParty, securedParties, debtorParties)
  }

  function findFinancingStatement( regNum: string) {
    return fsList.value.find( element => {
      console.log('compare ', regNum, element.baseRegistrationNumber)
      return element.baseRegistrationNumber === regNum
    })
  }

  function registerFinancingStatement( fs: FinancingStatementModel): string {
    fs.registerLien()
    fsList.value.push(fs)
    return fs.baseRegistrationNumber
  }

  return {
    fsList,
    // functions
    createFinancingStatement,
    findFinancingStatement,
    registerFinancingStatement
  }
}
const instance = {_instance: undefined}
function Instance() {
  return instance._instance || (instance._instance = getDefs())
}

export function useFinancingStatments () {
  return Instance()
}

export function FSList(): FinancingStatementInterface[] {
  const list = [
  ]
  return list// FinancingStatementInterface[] = list.map( json => FinancingStatementModel.fromJson(json))
}
