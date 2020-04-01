/**
 * The interface to a person name.
 */
export interface PersonNameInterface {
  first?: string;
  middle?: string;
  last?: string;
}

/**
 * The model for a person name, such as for a registering party.
 */
export class PersonNameModel {
  private _first?: string
  private _middle?: string
  private _last?: string

  /**
   * Creates a new Person Name model instance.
   *
   * @param first the first name of the person.
   * @param middle the middle name of the person.
   * @param last the last name of the person.
   */
  public constructor(first?: string, middle?: string, last?: string) {
    this._first = first
    this._middle = middle
    this._last = last
  }

  /**
   * Gets the first name of the person.
   */
  public get first(): string | undefined {
    return this._first
  }

  /**
   * Gets the middle name of the person.
   */
  public get middle(): string | undefined {
    return this._middle
  }

  /**
   * Gets the last name of the person.
   */
  public get last(): string | undefined {
    return this._last
  }

  /**
   * Gets the JSON representation of the PersonNameModel object.
   */
  public toJson(): PersonNameInterface {
    return {
      first: this.first,
      middle: this.middle,
      last: this.last
    }
  }

  /*
   * Class declarations
   */

  /**
   * Gets a PersonNameModel object from a JSON string.
   *
   * @param jsonObject the JSON version of the object.
   */
  public static fromJson(jsonObject?: PersonNameInterface): PersonNameModel | undefined {
    let personNameModel: PersonNameModel | undefined

    if (jsonObject) {
      personNameModel = new PersonNameModel(jsonObject.first, jsonObject.middle, jsonObject.last)
    }

    return personNameModel
  }
}
