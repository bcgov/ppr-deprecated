// test/FeatureOne.spec.js

// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
// Utilities
import {mount, createLocalVue} from '@vue/test-utils'

// Components
import FeatureOne from '@/components/FeatureOne.vue'
// Application
import AppData from '@/utils/app-data'

Vue.use(Vuetify)
Vue.use(VueCompositionApi)
const localVue = createLocalVue()

describe('FeatureOne.vue', () => {
  let vuetify, wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
    wrapper = mount(FeatureOne, {
      localVue,
      vuetify,
    })

  })

  it('Test app data features', () => {
    expect(AppData.features.featureOne).toBeFalsy()
    AppData.features.featureOne = true
    expect(AppData.features.featureOne).toBeTruthy()
    AppData.features.featureOne = false
    expect(AppData.features.featureOne).toBeFalsy()
  })

  it('should have a custom label and match snapshot', () => {
    // With jest we can create snapshot files of the HTML output
    expect(wrapper.html()).toMatchSnapshot()

    // We could also verify this differently by checking the text content
    const checkboxLabel = wrapper.find('label')
    console.log('Found checkboxLabel', checkboxLabel.text())
    expect(checkboxLabel.text()).toContain('F One')
  })

  it('check should enable feature one', () => {
    const checkbox = wrapper.find('#featureOne')
    checkbox.trigger('click')
    expect(AppData.features.featureOne).toBeTruthy()
  })
})
