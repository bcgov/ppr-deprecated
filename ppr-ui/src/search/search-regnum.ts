import { inject, provide, reactive } from '@vue/composition-api'
import axiosAuth from '@/utils/axios-auth'
import { AxiosResponse } from 'axios'

const MAX_CHAR = 8
const REG_EXP = /^[0-9a-zA-Z]{1,8}$/

// export text constants for use in tests
export const SS_TEXT = {
  errorMsg: (text: string): string => `Error with registration number search - ${text}`,
  describeValid: `A valid registration number has up to ${MAX_CHAR} letters and numbers`,
  label: 'Registration number',
  required: 'The registration number is required',
  tooLong: `Entered registration number its too long. Maximum length is ${MAX_CHAR} characters`
}

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

interface Validator {
  (value: string): boolean | string;
}

export class SearcherRegNum {
  private static _instance: SearcherRegNum

  public static Instance(baseUrl: string): SearcherRegNum {
    return this._instance || (this._instance = new this(baseUrl))
  }

  /*
  Private members for holding the search term, results and/or error
   */
  private _errorMessage: string
  private _results: RegNumResult[]
  private _term: string
  private _searchId: string
  private readonly _baseUrl: string
  private readonly _validationRules: Validator[]

  public constructor(baseUrl: string) {
    this._errorMessage = ''
    this._results = []
    this._term = ''
    this._baseUrl = baseUrl
    this._searchId = ''
    this._validationRules = [
      (value): (boolean | string) => {
        return !!value || SS_TEXT.required
      },
      (value): (boolean | string) => {
        return value.length <= MAX_CHAR || SS_TEXT.tooLong
      },
      (value): (boolean | string) => {
        return REG_EXP.test(value) || SS_TEXT.describeValid
      }
    ]
  }

  public get errorMessage(): string {
    return this._errorMessage
  }

  public get label(): string {
    return SS_TEXT.label
  }

  public get term(): string {
    return this._term
  }

  public get results(): RegNumResult[] {
    return this._results
  }

  public get describeValid(): string {
    return SS_TEXT.describeValid
  }

  public get validationRules(): Validator[] {
    return this._validationRules
  }

  // This is a public method is for testing the validation rules.
  public validate(input: string): string | undefined {
    // iterate over the rules ... if any rule results in a string error message ...
    // ... then return the result of running that rule.
    let rule = this._validationRules.find((aRule: Validator): boolean => typeof aRule(input) === 'string')
    return rule ? rule(input) as string : undefined
  }

  public doSearch(term: string): Promise<string> {
    this._errorMessage = ''
    this._results = []
    // save the search term for reuse when displaying results or errors
    this._term = term
    const data = {
      'type_code': 'REGISTRATION_NUMBER',
      'criteria': { 'value': this._term }
    }
    const config = {
      headers: {
        'Accept': 'application/json',
        'ResponseType': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
    let url = `${this._baseUrl}searches`
    return axiosAuth
      .post(url, data, config)
      .then((response): Promise<AxiosResponse> => {
        if (response && response.data) {
          this._searchId = response.data.id
          url = `${this._baseUrl}searches/${this._searchId}/results`
          return axiosAuth.get(url, config)
        }
        this._errorMessage = SS_TEXT.errorMsg('invalid response data on post')
        return Promise.reject(this._errorMessage)
      })
      .then((response): Promise<string> => {
        // process the response from the get search id
        if (response && response.data) {
          this._results = response.data
          return Promise.resolve('success')
        }
        this._errorMessage = SS_TEXT.errorMsg('invalid response data on get')
        return Promise.reject(this._errorMessage)
      })
      .catch(
        (error): Promise<string> => {
          // console.error('search error', error)
          this._errorMessage = SS_TEXT.errorMsg(error)
          return Promise.reject(this._errorMessage)
        })
  }
}

export const SearcherRegNumSymbol = Symbol()

export function provideSearcherRegNum(baseUrl: string): void {
  provide(SearcherRegNumSymbol, reactive(SearcherRegNum.Instance(baseUrl)))
}

export function useSearcherRegNum(): SearcherRegNum {
  const searcherRegNum: SearcherRegNum = inject(SearcherRegNumSymbol) as SearcherRegNum
  if (!searcherRegNum) {
    throw Error('searcherRegNum cannot be injected, it must have been provided first')
  }
  return searcherRegNum
}
