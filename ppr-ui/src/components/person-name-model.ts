
interface PersonNameInnerInterface {
  first: string;
  middle: string;
  last: string;
}
/**
 * The interface to a person name.
 */
export interface PersonNameInterface {
  personName: PersonNameInnerInterface;
}

/**
 * The model for a person name, such as for a registering party.
 */
export class PersonNameModel implements PersonNameInterface {
  // declare property to hold the person's name and match structure of the API.  Also need to explicitly construct
  // the object so the constructor can refer to the inner properties (first, middle, last)
  private _personName: PersonNameInnerInterface = {
    first: undefined,
    middle: undefined,
    last: undefined
  }

  /**
   * Creates a new Person Name model instance.
   *
   * @param first the first name of the person.
   * @param middle the middle name of the person.
   * @param last the last name of the person.
   */
  public constructor(first: string = '', middle: string = '', last: string = '') {
    this._personName.first = first
    this._personName.middle = middle
    this._personName.last = last
  }

  /**
   * Gets personName
   */
  public get personName(): PersonNameInnerInterface {
    return this._personName
  }

  /**
   * Gets the first name of the person.
   */
  public get first(): string {
    return this._personName.first
  }

  /**
   * Gets the middle name of the person.
   */
  public get middle(): string {
    return this._personName.middle
  }

  /**
   * Gets the last name of the person.
   */
  public get last(): string {
    return this._personName.last
  }

  /**
   * Gets the JSON representation of the PersonNameModel object.
   */
  public toJson(): PersonNameInterface {
    return {
      personName: {
        first: this.first,
        middle: this.middle,
        last: this.last
      }
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
  public static fromJson(jsonObject: PersonNameInterface): PersonNameModel {
    return new PersonNameModel(
      jsonObject.personName.first,
      jsonObject.personName.middle,
      jsonObject.personName.last)
  }
}
