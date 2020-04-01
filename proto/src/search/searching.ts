import {computed, ref} from '@vue/composition-api'


function getDefs() {

  const userSearchList = ref()

  function doSearch(term: string): void {
  }

  function getSearch(searchId: string) {

  }

  function getResults(searchId: string) {

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
