import axios from 'axios'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCompositionApi from '@vue/composition-api'
import { mount, RouterLinkStub, Wrapper } from '@vue/test-utils'

import { LoadIndicator, LoadIndicatorSymbol } from '@/load-indicator'
import router, { RouterSymbol } from '@/router/router'
import FinancingStatementView from '@/views/FinancingStatementView.vue'

jest.mock('@/utils/config')
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

Vue.use(Vuetify)
Vue.use(VueCompositionApi)
const loadIndicator = LoadIndicator.Instance

describe('FinancingStatementView.vue', (): void => {
  describe('View financing statement', (): void => {
    let wrapper: Wrapper<Vue>
    const $route = {
      path: '/financing',
      query: { 'regNum': '123456b' }
    }

    beforeEach((): void => {
      mockedAxios.get.mockResolvedValue({ data: 'somedata' })
      wrapper = mount(FinancingStatementView, {
        mocks: {
          $route
        },
        router: router,
        vuetify: new Vuetify({}),
        provide: {
          [LoadIndicatorSymbol]: loadIndicator,
          [RouterSymbol]: router
        },
        stubs: {
          // https://stackoverflow.com/questions/49681546/vue-test-utils-unknown-custom-element-router-link
          RouterLink: RouterLinkStub
        }
      })
    })

    it('Test the financing view submitted text', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      await new Promise((r) => setTimeout(r, 2000))
      expect(wrapper.get('#financingStatement').text()).toContain('submitted financing statement')
    })
  })

  describe('Edit financing statement', (): void => {
    let wrapper: Wrapper<Vue>
    const $route = {
      path: '/financing'
    }

    beforeEach((): void => {
      mockedAxios.get.mockResolvedValue({ data: 'somedata' })
      wrapper = mount(FinancingStatementView, {
        mocks: {
          $route
        },
        router: router,
        vuetify: new Vuetify({}),
        provide: {
          [LoadIndicatorSymbol]: loadIndicator,
          [RouterSymbol]: router
        },
        stubs: {
          // https://stackoverflow.com/questions/49681546/vue-test-utils-unknown-custom-element-router-link
          RouterLink: RouterLinkStub
        }
      })
    })

    it('Test the financing view created text', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      await new Promise((r) => setTimeout(r, 2000))
      expect(wrapper.get('#financingStatement').text()).toContain('create a financing statement')
    })

    it('Test invoke search on the search page', (done): void => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm = wrapper.vm as any
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      Vue.nextTick(async () => {
        const button = vm.$el.querySelector('#submit-btn')
        expect(button.textContent).toContain('Submit')
        await button.click()
        done()
      })
    })
  })
})
