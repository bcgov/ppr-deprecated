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
import { useLoadIndicator } from '@/load-indicator'
import FinancingStatement from '@/financing-statement/FinancingStatement.vue'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { PersonModel } from '@/components/person-model'

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
      // replace this delay with the API POST
      setTimeout(() => {
        loadIndicator.stop()
        root.$router.push({ name: 'financing', query: { regNum: '123456g' } })
      }, 2000)
    }

    if (regNum) {
      loadIndicator.start()
      // replace this delay with the API GET
      setTimeout(() => {
        financingStatement.value = new FinancingStatementModel(undefined, 25, new PersonModel('John', 'M', 'Doe'))
        editing.value = false
        loadIndicator.stop()
      }, 2000)
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
