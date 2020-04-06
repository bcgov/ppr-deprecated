import uniqid from 'uniqid'
import moment from 'moment'
import { useUsers } from '@/users/users'
import { ref } from '@vue/composition-api'

export interface PaymentRecordInterface {
  id: string;
  userId: string;
  code: string;
  date: string;
  amount: string;
  folio: string;
}

export class PaymentRecord implements PaymentRecordInterface {
  readonly _id: string
  readonly _amount: string
  readonly _code: string
  readonly _date: string
  readonly _folio: string
  readonly _quantity: string
  readonly _userId: string

  constructor(
    id: string,
    amount: string,
    code: string,
    date: string,
    folio: string,
    quantity: string,
    userId: string
  ) {
    this._id = id
    this._amount = amount
    this._code = code
    this._date = date
    this._folio = folio
    this._quantity = quantity
    this._userId = userId
  }
  public get id() {
    return this._id
  }
  public get userId() {
    return this._userId
  }
  public get date() {
    return this._date
  }
  public get code() {
    return this._code
  }
  public get amount() {
    return this._amount
  }
  public get folio() {
    return this._folio
  }
  public get quantity() {
    return this._quantity
  }
}

function getDefs() {
  // PRIVATE
  let recordList = undefined

  /**
   * Get the internal list of all records
   * @return {PaymentRecordInterface[]}
   * @private
   */
  function _getRecordsList(): PaymentRecordInterface[] {
    if(!recordList) {
      recordList = []
      const stash = localStorage.getItem('paySystem')
      if(stash) {
        recordList = JSON.parse(stash).map(stashed => {
          const record = new PaymentRecord(
            stashed._id,
            stashed._amount,
            stashed._code,
            stashed._date,
            stashed._folio,
            stashed._quantity,
            stashed._userId
          )
          return record
        })
      }
    }
    // console.log('get list ', searchList)
    return recordList
  }

  /**
   * Stash the given record for recall later
   * @private
   * @param record
   */
  function _stashRecord(record) {
    const list = _getRecordsList()
    list.push(record)
    localStorage.setItem('paySystem', JSON.stringify(list, null, 2))
  }

  /**
   * Get the current user id for filtering and authentication purposes
   * @return {string}
   * @private
   */
  function _getUserId() {
    const { currentUser } = useUsers()
    return currentUser.value.userId
  }

  function paymentDo(amount: string, code: string, folio: string, quantity: string): string {
    const paymentId = uniqid.time()
    const userId = _getUserId()
    const date = moment().format('YYYY-MM-DD HH:mm:ss')
    const record = new PaymentRecord(
      paymentId,
      amount,
      code,
      date,
      folio,
      quantity,
      userId
    )
    // console.log('stash payment record', JSON.stringify(record,null,2))
    _stashRecord(record)
    return record.id
  }

  // TODO change this to get list by user's account
  function paymentGetUserList(): PaymentRecordInterface[] {
    const userId = _getUserId()
    return _getRecordsList().filter((rec: PaymentRecordInterface) => rec.userId === userId )
  }

  // PROTOTYPE ADMIN
  function paymentAdminReset() {
    localStorage.removeItem('paySystem')
  }

  return {
    paymentDo,
    paymentGetUserList,
    paymentAdminReset
  }
}

const instance = {_instance: undefined}
function Instance() {
  return instance._instance || (instance._instance = getDefs())
}

export function usePaymentSystem () {
  return Instance()
}
