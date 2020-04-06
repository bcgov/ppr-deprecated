<template lang="pug">
  div
    v-container(class="view-container")
      article(id="financingStatementIntro")
        financing-statement-intro(:value="financingStatement",:editing="editing")
    v-container(class="view-container")
      article(id="financingStatement")
        section(v-if="editing")
          v-form
            financing-statement-tab(
              :value="financingStatement",
              :editing="editing",
              @input="updateFinancingModel",
              @valid="formValid = $event"
            )
            v-btn(
              id="submit-btn",
              color="primary",
              :disabled="!formValid",
              @click="submit"
            ) {{ submitButtonText }}

        section(v-else)
          financing-statement-tab(
            :value="financingStatement",
            :editing="editing"
          )
    payment-dialog(
    title="Pay and Register",
    :open="openPaymentDialog",
    paymentCode="REGISTER",
    :quantity="''+financingStatement.lifeYears",
    @proceed="proceed",
    @cancel="cancel"
    )
</template>

<script lang="ts">
import { computed, createComponent, ref, Ref } from '@vue/composition-api'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { useFinancingStatements } from '@/financing-statement/financing-statement-store'
import { useUsers, Roles } from '@/users/users'
import FinancingStatementIntro from '@/financing-statement/FinancingStatementIntro.vue'
import FinancingStatementTab from '@/financing-statement/FinancingStatementTab.vue'
import PaymentDialog from "@/payment/PaymentDialog.vue"


export default createComponent({
  components: { FinancingStatementTab, FinancingStatementIntro, PaymentDialog },

  setup(_, { root }) {
    const { createFinancingStatement, findFinancingStatementByRegNum, registerFinancingStatement } = useFinancingStatements()
    const { currentRole } = useUsers()

    const editing = ref(true)

    const formValid = ref(true)

    const financingStatement: Ref<FinancingStatementModel> = ref(createFinancingStatement())

    const openPaymentDialog = ref<boolean>(false)

    const regNum = root.$route.query ? root.$route.query['regNum'] as string : undefined

    const submitted = ref(root.$route.query['success'] === 'true')

    const submitButtonText = computed(() => (currentRole.value !== Roles.Staff ? 'Pay and Register' : 'Register'))


    if (regNum) {
      financingStatement.value = findFinancingStatementByRegNum(regNum)
      editing.value = false
    } else {
      editing.value = true
    }

    function updateFinancingModel(newValue: FinancingStatementModel) {
      financingStatement.value = newValue
    }

    function submit() {
      openPaymentDialog.value = true
    }

    function proceed() {
      // User does not need to pay or consented to pay.
      openPaymentDialog.value = false
      const baseRegistrationNumber = registerFinancingStatement(financingStatement.value)
      root.$router.push({ name: 'financing', query: { regNum: baseRegistrationNumber, success: "true" } })
    }
    function cancel() {
      // User chose to not pay.
      openPaymentDialog.value = false
    }


    return {
      cancel,
      editing,
      financingStatement,
      formValid,
      openPaymentDialog,
      proceed,
      submit,
      submitted,
      submitButtonText,
      updateFinancingModel
    }
  }
})
</script>
