import uniqid from 'uniqid'
import moment from 'moment'
import { FinancingStatementInterface } from '@/financing-statement/financing-statement-model'
import { useFinancingStatements } from '@/financing-statement/financing-statement-store'
import { useUsers } from '@/users/users'

export enum SearchTypes {
  REG_NUM,
  DEBTOR,
  SECURED,
  SERIAL,
  GENERAL
}
export interface SearchInterface {
  id: string;
  userId: string;
  type: SearchTypes;
  term: string;
  date: string;
  list: string[];
}

export class SearchRecord implements SearchInterface {
  readonly _id: string
  readonly _userId: string
  readonly _type: SearchTypes
  readonly _term: string
  readonly _date: string
  readonly _list: string[]
  constructor(id: string, userId: string, type: SearchTypes, term: string, date: string) {
    this._id = id
    this._userId = userId
    this._type = type
    this._term = term
    this._date = date
    this._list = []
  }
  public addToList(regnum: string) {
    this._list.push(regnum)
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
  public get term() {
    return this._term
  }
  public get date() {
    return this._date
  }
  public get list() {
    return [...this._list]
  }
}

function getDefs() {

  // PRIVATE
  let searchList = undefined

  function getList(): SearchInterface[] {
    if(!searchList) {
      searchList = []
      const stash = localStorage.getItem('searchList')
      if(stash) {
        searchList = JSON.parse(stash).map(elem => {
          const record = new SearchRecord(elem._id, elem._userId, elem._type, elem._term, elem._date)
          // transfer the list of base registration numbers
          // TODO add, if needed, amendment ids
          elem._list.forEach(regnum => record.addToList(regnum))
          return record
        })
      }
    }
    // console.log('get list ', searchList)
    return searchList
  }

  function addToList(record) {
    const list = getList()
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
      const {findFinancingStatement} = useFinancingStatements()
      const stmt = findFinancingStatement(record.term)
      console.log('found? ', stmt)
      if(stmt) {
        record.addToList(stmt.baseRegistrationNumber)
        // TODO add, if needed, amendment ids
      }
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
    addToList(record)
    return record.id
  }

  function searchGet(searchId: string): SearchInterface {
    const userId = getUserId()
    return getList().find((rec: SearchInterface) => {
      return rec.id === searchId && rec.userId === userId
    })
  }

  function searchGetResults(searchId: string): FinancingStatementInterface[] {
    const {findFinancingStatement} = useFinancingStatements()
    const record = searchGet(searchId)
    // console.log('get results', searchId, record)
    const results: FinancingStatementInterface[] = []
    if(record) {
      record.list.map( num => {
        const stmt = findFinancingStatement(num)
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
