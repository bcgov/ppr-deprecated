// import uniqid from 'uniqid'
const uniqid = require('uniqid')

import {ref} from '@vue/composition-api'
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
  type: SearchTypes;
  term: string;
  date: number;
}

export class SearchRecord implements SearchInterface {
  private _id: string
  public _type: SearchTypes
  public _term: string
  public _date: number
  constructor(type: SearchTypes, term: string) {
    this._id = uniqid.time()
    this._type = type
    this._term = term
    this._date = Date.now()
  }
  public get id() {
    return this._id
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
}

function getDefs() {
  const userSearchList = ref()
  const { currentUser } = useUsers()

  function doSearch(type: SearchTypes, term: string): string {
    const { searchAdd } = useUsers()
    const record = new SearchRecord(type, term)
    searchAdd(record)
    return record.id
  }

  function getSearch(searchId: string): void {
    const { searchGetList } = useUsers()
    return searchGetList().find(rec => rec.id === searchId)
  }

  function getResults(searchId: string): void {
  }

  return {doSearch, getSearch, getResults}
}

const instance = {_instance: undefined}

function Instance() {
  return instance._instance || (instance._instance = getDefs())
}

export function useSearching() {
  return Instance()
}
