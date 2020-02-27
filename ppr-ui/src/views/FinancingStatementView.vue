<template>
  <div>
    <v-container class="view-container">
      <router-link to="home">
        Home
      </router-link>
    </v-container>
    <v-container class="view-container">
      <article id="financingStatement">
        <header>
          <h1>Create Financing Statement</h1>
        </header>
        <p>
          <em>Note: This web site is a work in progress.</em>
        </p>
        <section v-if="editing">
          <div>
            <p>
              Need copy here to instruct user as to how to create a financing statement.
              Future development will include; debtors, collateral, and secured parties
            </p>
          </div>
          <v-form>
            <financing-statement
              v-model="financingStatement"
              :editing="editing"
              @valid="formValid = $event"
            />
            <v-btn
              id="submit-btn"
              color="primary"
              :disabled="!formValid"
              @click="submit"
            >
              Submit
            </v-btn>
          </v-form>
        </section>
        <section v-else>
          <div>
            <p>
              Need copy here to tell user this is their submitted financing statement.
              Future development will include; debtors, collateral, and secured parties
            </p>
          </div>
          <financing-statement
            v-model="financingStatement"
            :editing="editing"
          />
        </section>
      </article>
    </v-container>
  </div>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'

import FinancingStatement from '@/financing-statement/FinancingStatement.vue'
import { FinancingStatementModel, FinancingStatementInterface } from '@/financing-statement/financing-statement-model'
import { useLoadIndicator } from '@/load-indicator'
import axiosAuth from '@/utils/axios-auth'
import Config from '@/utils/Config'

export default createComponent({
  components: { FinancingStatement },

  setup(_, { root }) {
    const editing = ref(true)
    const formValid = ref(true)
    const financingStatement = ref(new FinancingStatementModel())
    const loadIndicator = useLoadIndicator()
    const regNum = root.$route.query ? root.$route.query['regNum'] as string : undefined

    function submit() {
      loadIndicator.start()

      const url = Config.apiUrl + 'financing-statements'
      axiosAuth.post(url, financingStatement.value.toJson()).then((response): void => {
        loadIndicator.stop()
        root.$router.push({ name: 'financing', query: { regNum: response.data.baseRegistrationNumber } })
      }).catch(error => {
        console.error(error)
      })
    }

    if (regNum) {
      loadIndicator.start()

      const url = Config.apiUrl + 'financing-statements/' + regNum
      axiosAuth.get<FinancingStatementInterface>(url).then((response): void => {
        editing.value = false
        loadIndicator.stop()
        financingStatement.value = FinancingStatementModel.fromJson(response.data)
      }).catch(error => {
        console.error(error)
      })
    } else {
      editing.value = true
    }

    return {
      editing,
      financingStatement,
      formValid,
      submit
    }
  }
})
</script>
