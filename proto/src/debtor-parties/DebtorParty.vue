<template lang="pug">
  div(style="display:inline")
    v-card(flat, v-if="editing")
      v-form(
        v-if="editing",
        :class="getFormClass()",
        class="base-party-form",
        @input="emitValid('party', $event)"
      )
        v-text-field(
        label="Business",
        :value="value.business",
        @input="update('business', $event)"
        )
        v-row
          v-col
            v-text-field(
            label="First",
            :value="value.first",
            @input="update('first', $event)"
            )
          v-col
            v-text-field(
            label="Middle",
            :value="value.middle",
            @input="update('middle', $event)"
            )
          v-col
            v-text-field(
            label="Last",
            :value="value.last",
            @input="update('last', $event)"
            )
        address-segment(
          :editing="editing",
          :value="value.address",
          @input="update('address', $event)",
          @valid="emitValid('address', $event)"
        )
    div(v-else, style="display:inline")
      div(v-if="layout==='condensed'")  display condensed {{value }}
      div(v-if="layout==='minimal'",style="display:inline")   display minimal {{value }}
      div(v-else)  display full {{value }}
</template>

<script lang="ts">
import { computed, createComponent, ref } from '@vue/composition-api'
import { AddressModel } from '@/address/address-model'
import { DebtorModel } from '@/debtor-parties/debtor-model'
import AddressSegment from '@/address/AddressSegment.vue'

export default createComponent({
  components: { AddressSegment },
  props: {
    layout: {
      default: 'full',
      required: false,
      type: String
    },
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    prompt: {
      type: String
    },
    value: {
      required: true,
      type: DebtorModel
    }
  },

  setup(props, { emit }) {

    const formIsValid = ref<boolean>(false)
    const debtor = ref(props.value)

    /*  Create a structure to hold the validation state of the various sections of the form.
    */
    const validationState: StringKeyedObject = {}
    validationState['party'] = false
    validationState['address'] = false

    function emitValid(key: string, validElement: boolean) {
      validationState[key] = validElement
      let formValid = validationState['party']
      formValid = formValid && validationState['address']
      // todo restore validation
      formIsValid.value = true
      emit('valid', true)
    }

    function getFormClass() {
      return {
        invalid: props.editing ? !formIsValid.value : false
      }
    }

    function update (key: string, model: string | AddressModel) {
      const prev = props.value
      let newModel: DebtorModel
      if (key === 'business') {
        newModel = new DebtorModel(model, prev.first, prev.middle, prev.last, prev.address, prev.birthDate)
      }
      if (key === 'first') {
        newModel = new DebtorModel(prev.business, model, prev.middle, prev.last, prev.address, prev.birthDate)
      }
      if (key === 'middle') {
        newModel = new DebtorModel(prev.business, prev.first, model, prev.last, prev.address, prev.birthDate)
      }
      if (key === 'last') {
        newModel = new DebtorModel(prev.business, prev.first, prev.middle, model, prev.address, prev.birthDate)
      }
      if (key === 'address') {
        newModel = new DebtorModel(prev.business, prev.first, prev.middle, prev.last, model, prev.birthDate)
      }
      if (key === 'birthDate') {
        newModel = new DebtorModel(prev.business, prev.first, prev.middle, prev.last, prev.address, model)
      }
      emit('input',newModel)
    }

    const { businessRules, businessUpdate} = useBusiness(debtor, emit)
    return {
      businessRules, businessUpdate,
      formIsValid,
      getFormClass,
      emitValid,
      update
    }
  }
})

  function useBusiness(debtor: DebtorModel, emit) {
    const businessRules = [
      (value: string): (boolean | string) => {
        console.log('!!value && !debtor.value.last', value, debtor.value.last)
        return !!value && !debtor.value.last || 'The business name is required if there is no person last name'
      }
    ]

    function businessUpdate(name: string): void {
      const prev = debtor.value
      emit('input', new DebtorModel(
        name,
        prev.first, prev.middle, prev.last, prev.address,
        prev.birthDate
      ))
    }
    return {
      businessRules, businessUpdate
    }
  }
</script>

<!-- must be unscoped to hide the radio button circles -->
<style lang="scss">
@import "../assets/styles/theme.scss";
.section {
  font-weight: bold;
}
.flex-center {
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-top: 0;
}

.base-party-form {
  padding: 1rem;
}

.filter-button {
  border: 1px solid black;
  padding-right: 2rem;
  .v-icon {
    display: none;
    visibility: hidden;
  }
}

.v-text-field {
  margin: 0;
  padding: 0;
}
.v-item--active {
  border: 1px solid $BCgovGold5;
}
</style>
