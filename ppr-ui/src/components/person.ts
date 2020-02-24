/**
 * Defines a person, such as a submitting party.
 */
export default class Person {
  private _firstName: string
  private _middleName: string
  private _lastName: string

  /**
   * Creates a new Person instance.
   * 
   * @param firstName the first name of the person.
   * @param middleName the middle name of the person.
   * @param lastName the last name of the person.
   */
  public constructor(firstName: string, middleName: string, lastName: string) {
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
   * Sets the first name of the person.
   *
   * @param firstName the new first name of the person.
   */
  public set firstName(firstName: string) {
    this._firstName = firstName
  }

  /**
   * Gets the middle name of the person.
   */
  public get middleName(): string {
    return this._middleName
  }

  /**
   * Sets the middle name of the person.
   *
   * @param middleName the new middle name of the person.
   */
  public set middleName(middleName: string) {
    this._middleName = middleName
  }

  /**
   * Gets the last name of the person.
   */
  public get lastName(): string {
    return this._lastName
  }

  /**
   * Sets the last name of the person.
   *
   * @param lastName the new last name of the person.
   */
  public set lastName(lastName: string) {
    this._lastName = lastName
  }
}
