import {inject, provide, reactive} from "@vue/composition-api"
import axiosAuth from "@/utils/axios-auth"
import AppData from '@/utils/app-data'

function baseUrl(): string {
  return AppData.config.pprApiUrl + 'search'
}

const TEXT = {
  errorMsg: (text): string => `Search serial number error - ${text}`,
  describeValidSerial: 'Serial number can have up to 25 letters or digits',
  defineValid: 'Serial number must be up to 25 letters or digits',
  required: 'Require serial number',
  tooLong: 'Serial number can only have 25 characters'
}

export interface SerialResult {
  match: string;
  make: string;
  vin: string;
  year: string;
}

interface VFunction {
  (value: string): boolean | string;
}

export class SearcherSerial {

  private static _instance: SearcherSerial

  public static get Instance(): SearcherSerial {
    return this._instance || (this._instance = new this())
  }

  /*
  Private members for holding the search term, results and/or error
   */
  private _errorMessage: string
  private _results: SerialResult[]
  private _term: string

  private readonly _serialNumberRules: VFunction[] // ((v: string) => (string | boolean))[]

  public constructor() {
    this._serialNumberRules = [
      (value): (boolean | string) => { return !!value || TEXT.required },
      (value): (boolean | string) => { return value.length <= 25 || TEXT.tooLong },
      (value): (boolean | string) => { return /^[0-9a-zA-Z]{1,25}$/.test(value) || TEXT.defineValid }
    ]
  }

  public get term(): string { return this._term}
  public get results(): SerialResult[] { return this._results}
  public get describeValidSerial(): string { return TEXT.describeValidSerial}

  public doSearch(baseUrl: string, term: string): Promise<string> {
    // save the search term for reuse when displaying results or errors
    this._term = term
    // console.log('Search for ', this._term)
    const config = {
      params: {
        serial: term
      },
      headers: {
        'Accept': 'application/json',
        'ResponseType': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }

    let url = baseUrl + 'search'
    console.log('Make the search api call', url)
    return new Promise((resolve, reject): void => {
      axiosAuth
        .get(url, config)
        .then((response): void => {
          if (response && response.data) {
            this._results = response.data.results
            resolve('success')
          } else {
            this._errorMessage = TEXT.errorMsg('invalid response data')
            reject(this._errorMessage)
          }
        })
        .catch((error): void => {
          this._errorMessage = TEXT.errorMsg(error.message)
          reject(this._errorMessage)
        })
    })
  }

  public isValid(input: string): boolean {
    // iterate over the rules ... if any rule results in a string error message ...
    // ... then the input is invalid so return the inverse (because this is an 'isValid' check
    const isInvalid = this._serialNumberRules.some((rule: VFunction): boolean => typeof rule(input) === 'string')
    return !isInvalid
  }

  public get validationRules(): VFunction[] {
    return this._serialNumberRules
  }


}

export const SearcherSerialSymbol = Symbol()

export function provideSearcherSerial(): void {
  provide(SearcherSerialSymbol, reactive(SearcherSerial.Instance))
}

export function useSearcherSerial(): SearcherSerial {
  const searcherSerial: SearcherSerial = inject(SearcherSerialSymbol) as SearcherSerial
  if (!searcherSerial) {
    throw Error("SearcherSerial cannot be injected, it must have been provided first")
  }
  return searcherSerial
}
