import { ref } from '@vue/composition-api'
import { DebtorModel, } from '@/debtor-parties/debtor-model'
import { FinancingStatementInterface, FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import { GeneralCollateralModel } from '@/general-collateral/general-collateral-model'
import { SerialCollateralModel } from '@/serial-collateral/serial-collateral-model'
import { SecuredPartyModel} from '@/secured-parties/secured-party-model.ts'
import { useRegisteredParty } from '@/registering-party/registering-party-model'
import { useUsers } from '@/users/users'


function getDefs() {
  const financingStatementsList = ref(_loadList())

  function createFinancingStatement(): FinancingStatementModel {
    const { createFromCurrentUser } = useRegisteredParty()

    const firstSecuredParty = new SecuredPartyModel()
    firstSecuredParty.listId = 0
    const securedParties = [firstSecuredParty]

    const firstDebtor = new DebtorModel()
    firstDebtor.listId = 0
    const debtorParties = [firstDebtor]

    const firstGeneral = new GeneralCollateralModel()
    firstGeneral.listId = 0
    const generalCollateral = [firstGeneral]

    const firstSerial = new SerialCollateralModel()
    firstSerial.listId = 0
    const serialCollateral = [firstSerial]

    const registeringParty = createFromCurrentUser()

    return new FinancingStatementModel(
      FinancingStatementType.SECURITY_AGREEMENT,
      5,
      registeringParty,
      securedParties,
      debtorParties,
      generalCollateral,
      serialCollateral
    )
  }

  function registerFinancingStatement( fs: FinancingStatementModel): string {
    fs.registerLien()
    financingStatementsList.value.push(fs)
    _saveList()
    return fs.baseRegistrationNumber
  }

  function clearFinancingStatementStash() {
    localStorage.removeItem('fslist')
    _loadList()
  }

  function getFinancingStatementStash(): string {
    return localStorage.getItem('fslist')
  }

  function loadFinancingStatementStash(jsonString): void {
    localStorage.setItem('fslist', jsonString)
    _loadList()
  }

  function getUsersFinancingStatementList() {
    const { currentUser } = useUsers()
    const party = currentUser.value.party
    const cc = party.clientCode
    const usersList = financingStatementsList.value.filter((fs) => {
      return fs.registeringParty.clientCode === cc
    })
    return usersList
  }

  function findFinancingStatementByRegNum( regNum: string): FinancingStatementInterface {
    return financingStatementsList.value.find( element => {
      return element.baseRegistrationNumber === regNum
    })

  }

  // Private methods

  function _loadList(): FinancingStatementInterface[] {
    const stash = localStorage.getItem('fslist')
    const list: FinancingStatementInterface[] = []
    if(stash) {
      try {
        let asStored: FinancingStatementInterface[] = JSON.parse(stash)
        asStored.forEach((jsonStr: FinancingStatementInterface): number => list.push(FinancingStatementModel.fromJson(jsonStr)))
      } catch(error) {
        console.error("Error parsing financing statement list", error)
      }
    }
    return list
  }
  function _saveList() {
    let list = []
    financingStatementsList.value.forEach((element: FinancingStatementModel) => list.push(element.toJson()))
    localStorage.setItem('fslist', JSON.stringify(list))
  }

  return {
    // refs
    // share the list ONLY for searching.  real app would not do this
    financingStatementsList,
    // functions
    createFinancingStatement,
    clearFinancingStatementStash,
    findFinancingStatementByRegNum,
    getFinancingStatementStash,
    getUsersFinancingStatementList,
    loadFinancingStatementStash,
    registerFinancingStatement
  }
}

const instance = {_instance: undefined}
function Instance() {
  return instance._instance || (instance._instance = getDefs())
}

export function useFinancingStatements () {
  return Instance()
}
