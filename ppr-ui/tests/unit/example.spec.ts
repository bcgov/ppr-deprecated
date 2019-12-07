// test/FeatureOne.spec.js

// // Libraries
import Vue from 'vue'
// import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
// Utilities
// import {createLocalVue} from '@vue/test-utils'
// import {mount, createLocalVue} from '@vue/test-utils'
//
// // Components
// import FeatureOne from '@/components/FeatureOne.vue'
// // Application
// import AppData from '@/utils/app-data'
//

import {useFeatureFlags, initializeFeatureFlags} from '@/flags/feature-flags'


// Vue.use(Vuetify)
Vue.use(VueCompositionApi)
// const localVue = createLocalVue()


describe('Feature flags ', (): void => {
  // let vuetify, wrapper

  beforeEach((): void => {
    // vuetify = new Vuetify()
    // wrapper = mount(FeatureOne, {
    //   localVue,
    //   vuetify,
  })

  it('Feature flag one', (): void => {
    initializeFeatureFlags()
    const flags = useFeatureFlags()
    expect(flags)
    // const f1 = flags.pocFeature1
    console.log('what is in here?', flags)
    // expect(AppData.features.featureOne).toBeFalsy()
    // AppData.features.featureOne = true
    // expect(AppData.features.featureOne).toBeTruthy()
    // AppData.features.featureOne = false
    // expect(AppData.features.featureOne).toBeFalsy()
  })

  /*  *********************
  TODO
  Unit tests ideally test the user interface ... what the user sees.  To test feature flags we need to bring
  in a component that displays something that is dependant on a flag. For example the Home component.

  But the Home.vue component depends on the injection of the router and that
  means a context is needed.
  The TODO is to figure out how to create this context for general unit testing now that Composition API is our standard.

   */

  //
  // })
  //
  // it('Test app data features', () => {
  //   expect(AppData.features.featureOne).toBeFalsy()
  //   AppData.features.featureOne = true
  //   expect(AppData.features.featureOne).toBeTruthy()
  //   AppData.features.featureOne = false
  //   expect(AppData.features.featureOne).toBeFalsy()
  // })
  //
  // it('should have a custom label and match snapshot', () => {
  //   // With jest we can create snapshot files of the HTML output
  //   expect(wrapper.html()).toMatchSnapshot()
  //
  //   // We could also verify this differently by checking the text content
  //   const checkboxLabel = wrapper.find('label')
  //   console.log('Found checkboxLabel', checkboxLabel.text())
  //   expect(checkboxLabel.text()).toContain('F One')
  // })
  //
  // it('check should enable feature one', () => {
  //   const checkbox = wrapper.find('#featureOne')
  //   checkbox.trigger('click')
  //   expect(AppData.features.featureOne).toBeTruthy()
  // })
})
