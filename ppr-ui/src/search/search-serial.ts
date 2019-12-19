import {inject, provide, reactive} from "@vue/composition-api"
import axios from "@/utils/axios-auth"
import AppData from '@/utils/app-data'

function baseUrl(): string {
  return AppData.config.pprApiUrl + 'search'
}

const TEXT = {
  errorMsg: (text): string => `Search serial number error - ${text}`
}

interface SerialResult {
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
      (value): (boolean | string) => { return !!value || 'Require serial number' }
      // the next comment demonstrates another check
      , (value): (boolean | string) => { return /^\d{4}$/.test(value) || 'serial number must be 4 digits' }
    ]
  }

  public get term(): string { return this._term}
  public get results(): SerialResult[] { return this._results}

  public doSearch(term: string): Promise<string> {
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

    let url = baseUrl()
    console.log('Make the search api call', url)
    return new Promise((resolve, reject): void => {
      axios
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
