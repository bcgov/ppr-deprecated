import { saveAs } from 'file-saver'
import { useFinancingStatements } from '@/financing-statement/financing-statement-store'


function getDefs(): object {

  const { getFinancingStatementStash, loadFinancingStatementStash } = useFinancingStatements()

  function loadFinancingStatements (file): void {
    const reader = new FileReader()
    reader.onload = (function (event) {
      const contents = event.target.result
      loadFinancingStatementStash(contents)
    })
    reader.readAsText(file)
  }

  function saveFinancingStatements(): void {
    const stringData = getFinancingStatementStash()
    const fileName = 'ppr-proto-fslist.json'
    const type = 'application/json'
    const blob = new Blob([stringData], {type: type})
    saveAs(blob, fileName)
  }

  return {
    loadFinancingStatements, saveFinancingStatements
  }
}

const instance = {_instance: undefined}
function Instance(): object {
  return instance._instance || (instance._instance = getDefs())
}

export function useAdmin(): object {
  return Instance()
}
