// test/FeatureOne.spec.js

// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
// Utilities
import {createLocalVue, mount} from '@vue/test-utils'
// Components
import Home from '@/views/Home.vue'
// Application
import {FeatureFlags, FeatureFlagSymbol} from "@/flags/feature-flags"
import {RouterSymbol} from '@/router/router'
import router from '@/router/router'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)
const localVue = createLocalVue()

describe('FeatureOne.vue', (): void => {
  let vuetify, wrapper
  const featureFlags = FeatureFlags.Instance

  beforeEach((): void => {
    vuetify = new Vuetify()
    wrapper = mount(Home, {
      localVue,
      vuetify,
      provide: {
        [FeatureFlagSymbol]: featureFlags,
        [RouterSymbol]: router
      }
    })
  })

  it('Test flagging feature one', (): void => {
    expect(featureFlags.feature1).toBeFalsy()
    featureFlags.feature1 = true
    expect(featureFlags.feature1).toBeTruthy()
  })

  it('the feature is enabled', (): void => {
    const element = wrapper.find('#fflag1')
    // console.log('Found element', element.text())
    expect(element.text()).toContain('enabled')
  })

})
