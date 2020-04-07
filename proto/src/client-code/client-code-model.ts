
export interface ClientCodeInterface {
  clientCode: string;
}

export class ClientCodeModel {
  private _clientCode: string

  public constructor(clientCode?: string) {
    this._clientCode = clientCode
  }

  public get clientCode(): string | undefined {
    return this._clientCode
  }

  public toJson(): ClientCodeInterface {
    return {clientCode: this._clientCode}
  }

  public static fromJson(jsonObject: ClientCodeInterface | undefined): ClientCodeModel {
    const clientCode = jsonObject ? jsonObject.clientCode : undefined
    return new ClientCodeModel(clientCode)
  }
}


