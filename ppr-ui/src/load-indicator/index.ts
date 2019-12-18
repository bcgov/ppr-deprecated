import {inject, provide, reactive} from "@vue/composition-api"

export class LoadIndicator {

  private static _instance: LoadIndicator

  private _isLoading: boolean
  private _loadingCount: number

  private constructor() {
    this._loadingCount = 0
    this._isLoading = false
  }

  public static get Instance(): LoadIndicator {
    return this._instance || (this._instance = new this())
  }

  public start(): void {
    this._loadingCount++
    this._isLoading = this._loadingCount > 0
  }

  public stop(): void {
    this._loadingCount--
    this._isLoading = this._loadingCount > 0
  }

  public isLoading(): boolean {
    return this._isLoading
  }
}

export const LoadIndicatorSymbol = Symbol()

export function provideLoadIndicator(): void {
  provide(LoadIndicatorSymbol, reactive(LoadIndicator.Instance))
}

export function useLoadIndicator(): LoadIndicator {
  const loadIndicator: LoadIndicator = inject(LoadIndicatorSymbol) as LoadIndicator
  if (!loadIndicator) {
    throw Error("LoadIndicator cannot be injected, has not been provided")
  }
  return loadIndicator
}
