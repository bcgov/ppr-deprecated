import uniqid from 'uniqid'
import moment from 'moment'
import { FinancingStatementInterface } from '@/financing-statement/financing-statement-model'
import { useFinancingStatements } from '@/financing-statement/financing-statement-store'
import { useUsers } from '@/users/users'
import { SerialCollateralModel } from '@/serial-collateral/serial-collateral-model'
import { DebtorModel, } from '@/debtor-parties/debtor-model'

export enum SearchTypes {
  REG_NUM,
  DEBTOR,
  SERIAL
}

export interface SearchResultsInterface {
  exact: string[];
  similar: string[]
}


export interface SearchInterface {
  id: string;
  userId: string;
  type: SearchTypes;
  typeAsString: string;
  term: string;
  date: string;
  exactList: string[];
  similarList: string[];
}

function typeToString( type: SearchTypes) {
  let str = ''
  if (type === SearchTypes.REG_NUM) str = 'Registration number search'
  if (type === SearchTypes.DEBTOR) str = 'Debtor search'
  if (type === SearchTypes.SERIAL) str = 'Serial number search'
  return str
}

export class SearchRecord implements SearchInterface {
  readonly _id: string
  readonly _userId: string
  readonly _type: SearchTypes
  readonly _typeAsString: string
  readonly _term: string
  readonly _date: string
  private _exactList: string[]
  private _similarList: string[]

  constructor(id: string, userId: string, type: SearchTypes, term: string, date: string) {
    this._id = id
    this._userId = userId
    this._type = type
    this._typeAsString = typeToString(type)
    this._term = term
    this._date = date
    this._exactList = []
    this._similarList = []
  }
  public addToExactList(regnum: string) {
    this._exactList.push(regnum)
  }
  public addToSimilarList(regnum: string) {
    this._similarList.push(regnum)
  }
  public get id() {
    return this._id
  }
  public get userId() {
    return this._userId
  }
  public get type() {
    return this._type
  }
  public get typeAsString() {
    return this._typeAsString
  }
  public get term() {
    return this._term
  }
  public get date() {
    return this._date
  }
  public get exactList() {
    return [...this._exactList]
  }
  public get similarList() {
    return [...this._similarList]
  }
  public resetLists (exact: Set<string>, similar?: Set<string>) {
    this._exactList = Array.from(exact) as string[]
    if(similar) {
      this._similarList = Array.from(similar) as string[]
    } else {
      this._similarList = []
    }

  }
}

function getDefs() {

  // PRIVATE
  let searchList = undefined

  function getSearchRecordsList(): SearchInterface[] {
    if(!searchList) {
      searchList = []
      const stash = localStorage.getItem('searchList')
      if(stash) {
        searchList = JSON.parse(stash).map(stashed => {
          const record = new SearchRecord(stashed._id, stashed._userId, stashed._type, stashed._term, stashed._date)
          // transfer the list of base registration numbers
          stashed._exactList.forEach(regnum => record.addToExactList(regnum))
          stashed._similarList.forEach(regnum => record.addToSimilarList(regnum))
          // TODO add, if needed, amendment ids
          return record
        })
      }
    }
    // console.log('get list ', searchList)
    return searchList
  }

  /**
   * Stash the given search record for recall later
   * @param record
   */
  function _addToSearchRecordsList(record) {
    const list = getSearchRecordsList()
    list.push(record)
    localStorage.setItem('searchList', JSON.stringify(list, null, 2))
  }

  function getUserId() {
    const { currentUser } = useUsers()
    return currentUser.value.userId
  }

  /**
   * Run the search and place the results into the given search record
   * @param {SearchRecord} record
   */
  function _runSearch(record: SearchRecord ) {
    console.log('_runSearch', record)
    if (record.type === SearchTypes.REG_NUM) {
      findFinancingStatementByRegNum(record)
    }
    if (record.type === SearchTypes.SERIAL) {
      findFinancingStatementsBySerial(record)
    }
    // TODO add search for other types
  }


  function findFinancingStatementByRegNum( record: SearchRecord) {
    const {financingStatementsList} = useFinancingStatements()
    const regNum = record.term
    const exact = new Set<string>()
    const found = financingStatementsList.value.find( element => {
      return element.baseRegistrationNumber === regNum
    })
    if(found) {
      exact.add(found.baseRegistrationNumber)
    }
    record.resetLists(exact)
  }

  function findFinancingStatementsBySerial( record: SearchRecord): void {
    const {financingStatementsList} = useFinancingStatements()
    const serial = record.term
    const exact = new Set<string>()
    const similar = new Set<string>()

    financingStatementsList.value.forEach( element => {
      const brn = element.baseRegistrationNumber
      element.serialCollateral.forEach((serialCollateral: SerialCollateralModel) => {
        const elementSerial = serialCollateral.serial
        if (elementSerial === serial) {
          exact.add(brn)
        } else {
          const lastSix = serial.substr(serial.length - 6)
          if (elementSerial === lastSix) {
            similar.add(brn)
          }
        }
      })
    })
    record.resetLists(exact, similar)
  }
  //  PUBLIC

  /**
   * given the search criteria and search type, create a search record, run the search and place
   * the results into the record, store the record, and finally return the search record id.
   * @param {SearchTypes} type
   * @param {string} term
   * @return {string}
   */
  function searchDo(type: SearchTypes, term: string): string {
    const searchId = uniqid.time()
    const userId = getUserId()
    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    const record = new SearchRecord(searchId, userId, type, term, date)
    _runSearch(record)
    _addToSearchRecordsList(record)
    return record.id
  }

  function searchGetResults(searchId: string): SearchInterface {
    const userId = getUserId()
    return getSearchRecordsList().find((rec: SearchInterface) => {
      return rec.id === searchId && rec.userId === userId
    })
  }


  function searchGetList(): SearchInterface[] {
    const userId = getUserId()
    return getSearchRecordsList().filter((rec: SearchInterface) => rec.userId === userId )
  }

  // PROTOTYPE ADMIN
  function searchAdminReset() {
    localStorage.removeItem('searchList')
  }

  return {
    findFinancingStatementByRegNum,
    searchAdminReset,
    searchDo,
    searchGetList,
    searchGetResults,
  }
}

const instance = {_instance: undefined}

function Instance() {
  return instance._instance || (instance._instance = getDefs())
}

export function useSearching() {
  return Instance()
}
