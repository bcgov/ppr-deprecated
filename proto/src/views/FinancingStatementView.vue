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
import FinancingStatement from '@/financing-statement/FinancingStatement.vue'
import { BasePartyModel } from '@/base-party/base-party-model'
import { FinancingStatementModel, FinancingStatementInterface } from '@/financing-statement/financing-statement-model'
import { useLoadIndicator } from '@/load-indicator'
import axiosAuth from '@/utils/axios-auth'


export default createComponent({
  components: { FinancingStatement },

  setup(_, { root }) {
    const editing = ref(true)
    const formValid = ref(true)
    // create FS model with defaults yet be sure secured parties has one empty party
    const firstSecuredParty = new BasePartyModel()
    firstSecuredParty.listId = 0
    const securedParties = [firstSecuredParty]
    const firstDebtor = new BasePartyModel()
    firstDebtor.listId = 0
    const debtorParties = [firstDebtor]
    const fstmt = new FinancingStatementModel(undefined, undefined, undefined, securedParties, debtorParties)
    const financingStatement = ref(fstmt)

    const loadIndicator = useLoadIndicator()
    const regNum = root.$route.query ? root.$route.query['regNum'] as string : undefined

    function submit() {
      loadIndicator.start()

      // const url = Config.apiUrl + 'financing-statements'
      // axiosAuth.post(url, financingStatement.value.toJson()).then((response): void => {
      //   loadIndicator.stop()
      //   root.$router.push({ name: 'financing', query: { regNum: response.data.baseRegistrationNumber } })
      // }).catch(error => {
      //   console.error(error)
      // })
    }

    if (regNum) {
      loadIndicator.start()

      // const url = Config.apiUrl + 'financing-statements/' + regNum
      // axiosAuth.get<FinancingStatementInterface>(url).then((response): void => {
      //   editing.value = false
      //   loadIndicator.stop()
      //   financingStatement.value = FinancingStatementModel.fromJson(response.data)
      // }).catch(error => {
      //   console.error(error)
      // })
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
