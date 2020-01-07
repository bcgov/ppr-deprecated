import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
import {shallowMount, Wrapper} from '@vue/test-utils'
import LoadIndicator from '@/load-indicator/LoadIndicator.vue'
import {LoadIndicator as LI, LoadIndicatorSymbol} from '@/load-indicator'

import {RouterSymbol} from '@/router/router'
import router from '@/router/router'

const loadIndicator = LI.Instance

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

describe('LoadIndicator.vue', (): void => {
  let wrapper: Wrapper<Vue>
  let vm

  beforeEach((): void => {
    wrapper = shallowMount(LoadIndicator, {
      provide: {
        [LoadIndicatorSymbol]: loadIndicator,
        [RouterSymbol]: router
      }
    })
    vm = wrapper.vm
  })

  afterEach( (): void => {
    wrapper.destroy()
  })

  it('Test flagging feature one', (): void => {
    expect(vm.isLoading).toEqual(false)
  })
})
