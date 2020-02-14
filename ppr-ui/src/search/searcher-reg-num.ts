import axiosAuth from '@/utils/axios-auth'
import { AxiosResponse } from 'axios'
import Config from '@/utils/Config'

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
    this._baseUrl = Config.apiUrl
  }

  public doSearch(term: string): Promise<AxiosResponse> {
    const data = {
      'type_code': 'REGISTRATION_NUMBER',
      'criteria': { 'value': term }
    }
    let url = this._baseUrl + 'searches'
    return axiosAuth
      .post(url, data)
      .then((response): Promise<AxiosResponse> => {
        return response.data.id
      })
  }

  public getSearchFees(): Promise<object> {
    // {{pay-api-base-url}}/api/v1/fees/CP/OTADR
    // TODO revisit fee request once PPR payment codes are in the system
    let url = Config.payApiUrl + '/fees/CP/OTADR'
    return axiosAuth.get(url).then((response): Promise<object> => response.data)
  }

  public getSearch(searchId: string): Promise<AxiosResponse> {
    let url = this._baseUrl + 'searches/' + searchId
    return axiosAuth.get(url)
  }

  public getResults(searchId: string): Promise<AxiosResponse> {
    let url = this._baseUrl + 'searches/' + searchId + '/results'
    return axiosAuth.get(url)
  }

}
