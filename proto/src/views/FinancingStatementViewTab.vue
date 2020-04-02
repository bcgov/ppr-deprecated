<template lang="pug">
  div
    v-container(class="view-container")
      article(id="financingStatementIntro")
        financing-statement-intro(:editing="editing")
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
            dialog-confirm(
              :value="confirmDialogOpen",
              title="Confirm Pay and Register",
              :message="confirmPaymentMessage",
              :options="{ok:'Confirm', width:600}",
              @cancel="confirmCanceled($event)",
              @ok="confirmConfirmed($event)"
            )

        section(v-else)
          financing-statement-tab(
            :value="financingStatement",
            :editing="editing"
          )
</template>

<script lang="ts">
import { computed, createComponent, ref } from '@vue/composition-api'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { useFinancingStatements } from '@/financing-statement/financing-statement-store'
import FinancingStatementTab from '@/financing-statement/FinancingStatementTab.vue'
import FinancingStatementIntro from '@/financing-statement/FinancingStatementIntro.vue'
import DialogConfirm from "@/components/DialogConfirm.vue"
import { useUsers, Roles } from '@/users/users'


export default createComponent({
  components: { DialogConfirm, FinancingStatementTab, FinancingStatementIntro },

  setup(_, { root }) {
    const editing = ref(true)
    const formValid = ref(true)
    const { createFinancingStatement, findFinancingStatement, registerFinancingStatement } = useFinancingStatements()
    const financingStatement = ref(createFinancingStatement())

    const regNum = root.$route.query ? root.$route.query['regNum'] as string : undefined

    const submitted = ref(root.$route.query['success'] === 'true' ? true : false)

    const { currentRole } = useUsers()
    const submitButtonText = computed(() => (currentRole.value !== Roles.Staff ? 'Pay and Register' : 'Register'))

    if (regNum) {
      financingStatement.value = findFinancingStatement(regNum)
      editing.value = false
    } else {
      editing.value = true
    }

    function updateFinancingModel(newValue: FinancingStatementModel) {
      // console.log('update fs', newValue)
      financingStatement.value = newValue
    }

    // Controls confirmation to register dialog state.
    const confirmDialogOpen = ref(false)

    const confirmPaymentMessage = computed((): string => {
      const fees = 5 * financingStatement.value.lifeYears
      return `To register this lien you need to pay $${fees}.  Do you wish to proceed?.`
    })

    function confirmCanceled() {
      confirmDialogOpen.value = false
    }

    function confirmConfirmed() {
      confirmDialogOpen.value = false
      const baseRegistrationNumber = registerFinancingStatement(financingStatement.value)
      root.$router.push({ name: 'financing', query: { regNum: baseRegistrationNumber, success: "true" } })
    }

    function submit() {
      confirmDialogOpen.value = true
    }


    return {currentRole,
      confirmCanceled,
      confirmConfirmed,
      confirmDialogOpen,
      confirmPaymentMessage,
      editing,
      financingStatement,
      formValid,
      submit,
      submitted,
      submitButtonText,
      updateFinancingModel
    }
  }
})
</script>
