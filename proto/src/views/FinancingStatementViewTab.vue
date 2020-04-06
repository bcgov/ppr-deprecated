<template lang="pug">
  div
    v-container(class="view-container")
      v-row
        v-col(cols="10")
          financing-statement-intro(:value="financingStatement",:editing="editing")
        v-col(cols="2")
          proto-to-do
            p.
              The Register a Lien page one of two primary functions of the PPR. It allows qualified users to register
              that a "secured party" holds a lien against a debtor with some specified property as collateral. This is
              registered to protect their claim in the case they need to go to court and seek remedies.
            p.
              In this prototype this form needs a lot of finishing touches.
            ul
              li User's who work with Tax Liens should only see these types.
              li User's who are marked a repairer's should default to the repairer lien type.
              li Repairer's Liens need to hide the Life In Years, Indenture, Infinity and show Surrender Date and ?
              li Add indenture boolean.  Add infinity life option and adjust the payment system.
              li If the user has only one client code in their account list then prepopulate the Secured Party record.
              li Add a dialog to let users add a new client to their account, for user in the Secured Party section.
              li.
                Store just the hidden client code in the Financing Statement. When a user views or edits a Financing
                Statement then do a lookup and replace the hidden code with a human readable description of the party.
              li Registering party needs to be stored as a client code and not the full data set.
              li General collateral validation and display of remaining characters (8,000 char limit)
              li.
                Serial collateral. Default to Vehicle type. Let user enter the VIN and use standard APIs or code to
                transform the VIN into Make, Model, Year. (https://www.autocheck.com/vehiclehistory/vin-basics)
              li Integrate with the drafts system.
              li.
                Add navigation guards so that when a user selects another web page they are prompted to confirm saving
                the draft.

              li Etcetera


    v-container(class="view-container")
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
import ProtoToDo from '@/components/ProtoToDo.vue'


export default createComponent({
  components: { ProtoToDo, FinancingStatementTab, FinancingStatementIntro, PaymentDialog },

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
