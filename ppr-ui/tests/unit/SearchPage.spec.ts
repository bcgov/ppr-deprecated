import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
import { mount, Wrapper } from '@vue/test-utils'
import SearchInput from '@/search/SearchInput.vue'
import SearchPage from '@/views/SearchPage.vue'
import { LoadIndicator, LoadIndicatorSymbol } from '@/load-indicator'
import router, { RouterSymbol } from '@/router/router'

// need to register Vuetify on the main Vue and, as well, in the mount
// Here this prevents warnings like "[Vue warn]: Unknown custom element: <v-container>"
// In the mount it prevents errors like "TypeError: Cannot read property 'width' of undefined" on the wrapper
Vue.use(Vuetify)
Vue.use(VueCompositionApi)

const loadIndicator = LoadIndicator.Instance

describe('SearchPage.vue', (): void => {
  let wrapper: Wrapper<Vue>
  beforeEach((): void => {
    wrapper = mount(SearchPage, {
      router: router,
      vuetify: new Vuetify({}),
      provide: {
        [LoadIndicatorSymbol]: loadIndicator,
        [RouterSymbol]: router
      }
    })
  })

  it('Test the search page', (): void => {
    const elem = wrapper.find('#mockSearchPage')
    expect(elem).toBeDefined()
    expect(elem.text()).toContain('Personal Property Registry')
  })


  it('Test the search page contains SearchInput', (): void => {
    expect(wrapper.find(SearchInput).exists()).toBe(true)
  })

  it('Test invoke search on the search page', (done): void => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    Vue.nextTick(async () => {
      const button = vm.$el.querySelector('#search-btn')
      expect(button.textContent).toContain('Search')
      await button.click()
      // TODO (See issue 360) find way to push value into the search input and verify the dosearch event was emitted
      // console.log(wrapper.emitted)
      // console.log(wrapper.html())
      done()
    })
  })
})
