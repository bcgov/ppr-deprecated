<template>
  <div>
    <v-container class="view-container">
      <article id="financingStatementIntro">
        <financing-statement-intro
          :editing="editing"
        />
      </article>
    </v-container>
    <v-container class="view-container">
      <article id="financingStatement">
        <section v-if="editing">
          <v-form>
            <financing-statement
              :value="financingStatement"
              :editing="editing"
              @input="updateFinancingModel"
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
            :value="financingStatement"
            :editing="editing"
          />
        </section>
      </article>
    </v-container>
  </div>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { useFinancingStatments } from '@/financing-statement/financing-statement-store'
import FinancingStatement from '@/financing-statement/FinancingStatement.vue'
import FinancingStatementIntro from '@/financing-statement/FinancingStatementIntro.vue'


export default createComponent({
  components: { FinancingStatement, FinancingStatementIntro },

  setup(_, { root }) {
    const editing = ref(true)
    const formValid = ref(true)
    const { createFinancingStatement, findFinancingStatement, registerFinancingStatement } = useFinancingStatments()
    const financingStatement = ref(createFinancingStatement())

    const regNum = root.$route.query ? root.$route.query['regNum'] as string : undefined

    function submit() {
      const baseRegistrationNumber = registerFinancingStatement(financingStatement.value)
      root.$router.push({ name: 'financing', query: { regNum: baseRegistrationNumber } })

      // const url = Config.apiUrl + 'financing-statements'
      // axiosAuth.post(url, financingStatement.value.toJson()).then((response): void => {
      //   loadIndicator.stop()
      //   root.$router.push({ name: 'financing', query: { regNum: response.data.baseRegistrationNumber } })
      // }).catch(error => {
      //   console.error(error)
      // })
    }

    if (regNum) {
      financingStatement.value = findFinancingStatement(regNum)
      // const url = Config.apiUrl + 'financing-statements/' + regNum
      // axiosAuth.get<FinancingStatementInterface>(url).then((response): void => {
      //   editing.value = false
      //   loadIndicator.stop()
      //   financingStatement.value = FinancingStatementModel.fromJson(response.data)
      // }).catch(error => {
      //   console.error(error)
      // })
      editing.value = false
    } else {
      editing.value = true
    }

    function updateFinancingModel(newValue: FinancingStatementModel) {
      financingStatement.value = newValue
    }

    return {
      editing,
      financingStatement,
      formValid,
      submit,
      updateFinancingModel
    }
  }
})
</script>
