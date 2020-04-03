<template lang="pug">
  div
    div(v-if="editing")
      v-row
        v-col(cols="12")
          v-form(@input="emitValid($event)")
            v-row
              v-col(cols="3")
                type-component(
                  :value="value.type",
                  @input="updateType"
                )
                v-text-field(
                  :value="value.lifeYears",
                  :rules="lifeRules",
                  label="Life in Years",
                  name="lifeInput",
                  @input="updateLife",
                )
              v-col(cols="1")
                v-btn(class="toggle") To be indenture
                v-btn(class="toggle") To be infinite life
              v-col(cols="2")
                div &nbsp;
              v-col(cols="6")
                div Registering Party
                registering-party(:value="value.registeringParty")
    div(v-else)
      v-row
        v-col(cols="12",sm="4")
          div Base Registration Number: {{ value.baseRegistrationNumber }}
          div Expiry Date: {{ value.expiryDate }}
          div Registration Date: {{ value.registrationDateTime }}
        v-col(cols="12",sm="4")
          div Type: {{ value.type }}
          div Life in Years: {{ value.lifeYears }}
        v-col(cols="12",sm="4")
          div Registering Party
          registering-party(:value="value.registeringParty", layout="minimal")
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import TypeComponent from '@/financing-statement/TypeComponent.vue'
import RegisteringParty from '@/registering-party/RegisteringParty.vue'

export default createComponent({
  components: {
    TypeComponent,
    RegisteringParty
  },
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: FinancingStatementModel
    }
  },

  setup(props, { emit }) {
    const formIsValid = ref<boolean>(false)

    const life = ref<number>(1)
    const lifeRules = [
      (value: string): (boolean | string) => {
        return !!value || 'Life is required'
      },
      (value: string): (boolean | string) => {
        return FinancingStatementModel.isValidYears(value) ? true : 'Life must be a number between 1 and 25'
      }
    ]

    /*  Create a structure to hold the validation state of the various sections of the form.
    */
    const validationState = {
      header: false,
      debtorParties: false,
      securedParties: false
    }

    function emitValid(formValid: boolean) {
      emit('valid', formValid)
    }

    // Callback function for emitting model changes made to the FS life
    function updateLife(newLife: number): void {
      emit('input', new FinancingStatementModel(
        props.value.type,
        newLife, // props.value.life,
        props.value.registeringParty,
        props.value.securedParties,
        props.value.debtorParties,
        props.value.generalCollateral,
        props.value.serialCollateral
      ))
    }

    // Callback function for emitting model changes made to the FS type
    function updateType(newType: FinancingStatementType): void {
      emit('input', new FinancingStatementModel(
        newType, //props.value.type,
        props.value.lifeYears,
        props.value.registeringParty,
        props.value.securedParties,
        props.value.debtorParties,
        props.value.generalCollateral,
        props.value.serialCollateral
      ))
    }

    return {
      formIsValid,
      life,
      lifeRules,
      updateLife,
      updateType,
      emitValid,
      validationState
    }
  }
})
</script>

<style lang="scss" scoped>

  .toggle {
    margin: 0 0 1rem 3rem;
    min-width: 14rem;
  }
.formInvalid {
  border: 1px solid blanchedalmond;
}

.v-card {
  padding: 1rem;
}
.customDash {
  .v-item-group {
    background-color: #f1f3f5 !important;
  }
  .v-tab {
    background-color: #38598A !important;
    color: white !important;
    font-size: 1.1rem;
    margin-right: 1rem;
  }
  .v-tab--active {
    background-color: #E6EAF4 !important;
    color: #0d47a1 !important;
  }
  .v-data-table {
    th {
      background-color: #38598A;
      color: #F8F9FA  !important;
      font-weight: bolder;
      font-size: 1.5rem;
    }

    th, td {
      padding-bottom: 2rem;
      font-size: 1.0rem;
    }
    tbody tr:nth-of-type(even) {
      background-color: white;
    }
  }
}

</style>
