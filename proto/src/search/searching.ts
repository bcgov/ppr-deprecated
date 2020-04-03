import uniqid from 'uniqid'
import moment from 'moment'
import { FinancingStatementInterface } from '@/financing-statement/financing-statement-model'
import { useFinancingStatements } from '@/financing-statement/financing-statement-store'
import { useUsers } from '@/users/users'

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
  readonly _exactList: string[]
  readonly _similarList: string[]
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

  function addToSearchRecordsList(record) {
    const list = getSearchRecordsList()
    list.push(record)
    localStorage.setItem('searchList', JSON.stringify(list, null, 2))
  }

  function getUserId() {
    const { currentUser } = useUsers()
    return currentUser.value.userId
  }

  function runSearch(record: SearchRecord ) {
    console.log('runSearch', record)
    if (record.type === SearchTypes.REG_NUM) {
      const {findFinancingStatementByRegNum} = useFinancingStatements()
      const stmt = findFinancingStatementByRegNum(record.term)
      console.log('found? ', stmt)
      if(stmt) {
        record.addToExactList(stmt.baseRegistrationNumber)
        // TODO add, if needed, amendment ids
      }
    }
    if (record.type === SearchTypes.SERIAL) {
      const {findFinancingStatementsBySerial} = useFinancingStatements()

      const results:SearchResultsInterface = findFinancingStatementsBySerial(record.term)
      console.log('findFinancingStatementsBySerial? ', results)
      results.exact.map((regNum:string) => record.addToExactList(regNum))
      results.similar.map((regNum:string) => record.addToSimilarList(regNum))
    }
    // TODO add search for other types
  }

  //  PUBLIC
  function searchDo(type: SearchTypes, term: string): string {
    const searchId = uniqid.time()
    const userId = getUserId()
    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    const record = new SearchRecord(searchId, userId, type, term, date)
    runSearch(record)
    addToSearchRecordsList(record)
    return record.id
  }

  function searchGet(searchId: string): SearchInterface {
    const userId = getUserId()
    return getSearchRecordsList().find((rec: SearchInterface) => {
      return rec.id === searchId && rec.userId === userId
    })
  }

  function searchGetList(): SearchInterface[] {
    const userId = getUserId()
    return getSearchRecordsList().filter((rec: SearchInterface) => rec.userId === userId )
  }

  function searchGetResults(searchId: string): FinancingStatementInterface[] {
    const {findFinancingStatementByRegNum} = useFinancingStatements()
    const record = searchGet(searchId)
    // console.log('get results', searchId, record)
    const results: FinancingStatementInterface[] = []
    if(record) {
      record.exactList.map( num => {
        const stmt = findFinancingStatementByRegNum(num)
        // TODO add, if needed, amendment ids
        results.push(stmt)
      })
    }
    return results
  }

  // PROTOTYPE ADMIN
  function searchAdminReset() {
    localStorage.removeItem('searchList')
  }

  return {
    searchAdminReset,
    searchDo,
    searchGet,
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
