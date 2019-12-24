// test/FeatureOne.spec.js

import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
import {shallowMount} from '@vue/test-utils'
import Home from '@/views/Home.vue'

import {FeatureFlags, FeatureFlagSymbol} from "@/flags/feature-flags"
const featureFlags = FeatureFlags.Instance

import {RouterSymbol} from '@/router/router'
import router from '@/router/router'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)

describe('FeatureOne.vue', (): void => {
  let wrapper

  beforeEach((): void => {
    wrapper = shallowMount(Home, {
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

  it('Test flagging feature two', (): void => {
    expect(featureFlags.feature2).toBeFalsy()
    featureFlags.feature2 = true
    expect(featureFlags.feature2).toBeTruthy()
  })

  it('the feature is enabled', (): void => {
    featureFlags.feature1 = true
    const element = wrapper.find('#fflag1')
    console.log(`Found element '${element.text()}'`)
    expect(element.text()).toContain('enabled')
  })

})
