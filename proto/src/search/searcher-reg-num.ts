
export interface RegNumResult {
  type: string;
  'financingStatement': {
    'type': string;
    'registeringParty': {};
    'securedParties': [];
    'debtors': [];
    'vehicleCollateral': [];
    'generalCollateral': [];
    'expiryDate': Date | null;
    'baseRegistrationNumber': string;
    'documentId': string;
    'registrationDateTime': string;
  };
}

export default class SearcherRegNum {

  public constructor() {
  }

  public doSearch(term: string): void {
  }

  public getSearch(searchId: string): Promise<Record<string, any>> {
    return Promise.resolve({})
  }

  // public getResults(searchId: string): Promise<> {
  //   return Promise.resolve()
  // }

}

function getDefs() {

  return { }
}
const instance = {_instance: undefined}
function Instance() {
  return instance._instance || (instance._instance = getDefs())
}

export function useSearching () {
  return Instance()
}
