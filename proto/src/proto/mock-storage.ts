import { UserList, UserInterface } from '../users/users'

/**
 * Singleton class to mock out data for prototype
 */
class MockStorage {
  private static _instance: MockStorage
  /**
   * Gets the singleton instance of the class.
   */
  public static get Instance(): MockStorage {
    return this._instance || (this._instance = new this())
  }

  private _userList: UserInterface[]
  private _currentUserIndex: number
  private _nextBaseRegistrationNumber: number

  private constructor() {
    console.log('construct a mock storage')
    this._userList = UserList()
    this._nextBaseRegistrationNumber = 1
    this.setCurrentUser(-1)
  }

  public isAuthed(): boolean {
    return this._currentUserIndex >= 0
  }

  public getUserList(): UserInterface[] {
    return this._userList
  }

  public getCurrentUser(): UserInterface| undefined {
    if ( this._currentUserIndex >= 0)
      return this._userList[this._currentUserIndex]
    return undefined
  }

  public getCurrentUserIndex(): number {
    return this._currentUserIndex
  }

  public setCurrentUser(index: number): void {
    if (index >= 0)
      sessionStorage.setItem('KEYCLOAK_TOKEN', ''+ index)
    else
      sessionStorage.removeItem('KEYCLOAK_TOKEN')
    this._currentUserIndex = index
    console.log('changed user to ', index, this.getCurrentUser())
  }

  public addFS (json) {
    this._nextBaseRegistrationNumber++

    return this._nextBaseRegistrationNumber
  }
}

export const mockStorage = MockStorage.Instance
