import {ref} from '@vue/composition-api'
import { useUsers } from '@/users/users'

function getDefs() {

  const userSearchList = ref()
  const { currentUser } = useUsers()

  function doSearch(term: string): void {
  }

  function getSearch(searchId: string): void {
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
