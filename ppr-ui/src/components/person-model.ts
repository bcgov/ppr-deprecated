/**
 * The model for a person, such as a registering party.
 */
export class PersonModel {
  private _firstName: string
  private _middleName: string
  private _lastName: string

  /**
   * Creates a new Person model instance.
   * 
   * @param firstName the first name of the person.
   * @param middleName the middle name of the person.
   * @param lastName the last name of the person.
   */
  public constructor(firstName: string = '', middleName: string = '', lastName: string = '') {
    this._firstName = firstName
    this._middleName = middleName
    this._lastName = lastName
  }

  /**
   * Gets the first name of the person.
   */
  public get firstName(): string {
    return this._firstName
  }

  /**
   * Gets the middle name of the person.
   */
  public get middleName(): string {
    return this._middleName
  }

  /**
   * Gets the last name of the person.
   */
  public get lastName(): string {
    return this._lastName
  }
}
