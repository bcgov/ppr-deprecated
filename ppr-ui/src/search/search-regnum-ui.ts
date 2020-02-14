
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

interface Validator {
  (value: string): boolean | string;
}

export default class SearchRegNumUi {
  private readonly _validationRules: Validator[]

  public constructor() {
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

  public get label(): string {
    return SS_TEXT.label
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
}
