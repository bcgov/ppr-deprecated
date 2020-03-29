
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
  private _baseUrl: string

  public constructor() {
  }

  // public doSearch(term: string); void {
  //   const data = {
  //     'type_code': 'REGISTRATION_NUMBER',
  //     'criteria': { 'value': term }
  //   }
  // }
  //
  // public getSearchFees(): void {
  //
  // }
  //
  // public getSearch(searchId: string): Promise<Object> {
  //   return Promise.resolve({})
  // }
  //
  // public getResults(searchId: string): Promise<> {
  //   return Promise.resolve()
  // }

}
