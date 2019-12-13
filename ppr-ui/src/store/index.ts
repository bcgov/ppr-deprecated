import Vue from 'vue'
import Vuex from 'vuex'
import {Store} from 'vuex'
import {inject, provide} from "@vue/composition-api"
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import {State} from './state'

Vue.use(Vuex)

const store: Store<State> = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export const StoreSymbol = Symbol()

export function provideStore(): void {
  provide(StoreSymbol, store)
}

export function useStore(): {store: Store<State>} {
  const store: Store<State> = inject(StoreSymbol) as Store<State>
  if (!store) {
    throw Error("Store cannot be injected, has not been provided")
  }
  return { store }
}

export default store
