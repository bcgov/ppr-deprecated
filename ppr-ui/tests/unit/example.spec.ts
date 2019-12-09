// test/FeatureOne.spec.js

// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
// Utilities
import {createLocalVue, mount} from '@vue/test-utils'
// Components
import FeatureOne from '@/components/FeatureOne.vue'
// Application
import {FeatureFlags, FeatureFlagSymbol} from "@/flags/feature-flags"

Vue.use(Vuetify)
Vue.use(VueCompositionApi)
const localVue = createLocalVue()

describe('FeatureOne.vue', (): void => {
  let vuetify, wrapper
  const featureFlags = FeatureFlags.Instance

  beforeEach((): void => {
    vuetify = new Vuetify()
    wrapper = mount(FeatureOne, {
      localVue,
      vuetify,
      provide: {[FeatureFlagSymbol]: featureFlags}
    })

  })

  it('Test flagging feature one', (): void => {
    expect(featureFlags.feature1).toBeFalsy()
    featureFlags.feature1 = true
    expect(featureFlags.feature1).toBeTruthy()
    featureFlags.feature1 = false
    expect(featureFlags.feature1).toBeFalsy()
  })

  it('should have a custom label and match snapshot', (): void => {
    // With jest we can create snapshot files of the HTML output
    expect(wrapper.html()).toMatchSnapshot()

    // We could also verify this differently by checking the text content
    const checkboxLabel = wrapper.find('label')
    console.log('Found checkboxLabel', checkboxLabel.text())
    expect(checkboxLabel.text()).toContain('F One')
  })

  it('check should enable feature one', (): void => {
    const checkbox = wrapper.find('#featureOne')
    checkbox.trigger('click')
    expect(featureFlags).toBeTruthy()
  })
})
