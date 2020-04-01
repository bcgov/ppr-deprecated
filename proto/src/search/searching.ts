import {ref} from '@vue/composition-api'


function getDefs() {

  const userSearchList = ref()

  function doSearch(term: string): void {
  }

  function getSearch(searchId: string): void {

  }

  function getResults(searchId: string): void {

  }

  return {doSearch, getSearch, getResults}
}

const instance = {_instance: undefined}

function Instance():object {
  return instance._instance || (instance._instance = getDefs())
}

export function useSearching():object {
  return Instance()
}
