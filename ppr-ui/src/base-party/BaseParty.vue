<template>
  <v-form
    :class="getFormClass()"
    class="base-party-form"
    data-test-id="BaseParty.form"
    @input="emitValid(HEADER, $event)"
  >
    <v-container class="flex-center">
      <!-- See #724 re pending styling of these radio buttons -->
      <v-radio-group
        v-if="editing"
        v-model="partyType"
        row
        class="justify-center"
      >
        <v-radio
          class="filter-button"
          data-test-id="BaseParty.radio.business"
          label="Business"
          :value="BUSINESS_NAME"
          @change="changeType(BUSINESS_NAME)"
        />
        <v-radio
          class="filter-button"
          data-test-id="BaseParty.radio.person"
          label="Person"
          :value="PERSON_NAME"
          @change="changeType(PERSON_NAME)"
        />
      </v-radio-group>
    </v-container>
    <business-name
      v-if="showBusinessName"
      data-test-id="BaseParty.business"
      :editing="editing"
      :value="value.businessName"
      @input="updateBusiness($event)"
      @valid="emitValid(BUSINESS_NAME, $event)"
    />
    <person-name
      v-if="showPersonName"
      data-test-id="BaseParty.person"
      :editing="editing"
      :value="value.personName"
      @input="updatePerson($event)"
      @valid="emitValid(PERSON_NAME, $event)"
    />
    <base-address
      :address="value.address"
      :editing="editing"
      @input="updateAddress($event)"
      @valid="emitValid(ADDRESS, $event)"
    />
  </v-form>
</template>

<script lang="ts">
import { computed, createComponent, ref } from '@vue/composition-api'

import BaseAddress from '@/components/BaseAddress.vue'
import BusinessName from '@/components/BusinessName.vue'
import PersonName from '@/components/PersonName.vue'
import { BasePartyModel } from '@/base-party/base-party-model'
import { BaseAddressModel } from '@/components/base-address-model'
import { BusinessNameModel } from '@/components/business-model'
import { PersonNameModel } from '@/components/person-name-model'

export default createComponent({
  components: { BaseAddress, BusinessName, PersonName },

  props: {
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
      type: BasePartyModel
    }
  },

  setup(props, { emit }) {

    const formIsValid = ref<boolean>(false)

    const ADDRESS = 'address'
    const BUSINESS_NAME = 'businessName'
    const HEADER = 'header'
    const PERSON_NAME = 'personName'

    /*  Create a structure to hold the validation state of the various sections of the form.
    */
    interface StringKeyedObject {
      [index: string]: boolean;
    }
    const validationState: StringKeyedObject = {}
    validationState[ADDRESS] = false
    validationState[BUSINESS_NAME] = false
    validationState[HEADER] = false
    validationState[PERSON_NAME] = false

    let type = (props.value.personName.first || props.value.personName.last) ? PERSON_NAME : BUSINESS_NAME
    // partyType tracks the active name. Start showing one model, say, the business name
    const partyType = ref(type)

    // Callback function for emitting form validity on all sections back to the parent.
    function emitValid(key: string, validElement: boolean) {
      validationState[key] = validElement
      let formValid = validationState[ADDRESS] && validationState[HEADER]
      if (partyType.value === BUSINESS_NAME) {
        formValid = formValid && validationState[BUSINESS_NAME]
      }
      if (partyType.value === PERSON_NAME) {
        formValid = formValid && validationState[PERSON_NAME]
      }
      formIsValid.value = formValid
      emit('valid', formValid)
    }

    const showBusinessName = computed((): boolean => partyType.value === BUSINESS_NAME)
    const showPersonName = computed((): boolean => partyType.value === PERSON_NAME)

    // Callback function for emitting the address model change back to the parent.
    function updateAddress(newValue: BaseAddressModel): void {
      emit('input', new BasePartyModel(
        props.value.businessName,
        props.value.personName,
        newValue
      ))
    }

    // Callback function for emitting the business name model change back to the parent.
    function updateBusiness(newValue: BusinessNameModel): void {
      emit('input', new BasePartyModel(
        newValue,
        props.value.personName,
        props.value.address
      ))
    }

    // Callback function for emitting the person name model change back to the parent.
    function updatePerson(newValue: PersonNameModel): void {
      emit('input', new BasePartyModel(
        props.value.businessName,
        newValue,
        props.value.address
      ))
    }

    // Callback function for tracking the current name model.
    // Intentional side effect to clear both business and person name fields.
    function changeType(type: string) {
      partyType.value = type
      const model = new BasePartyModel()
      emit('input', model)
    }

    function getFormClass() {
      return {
        invalid: props.editing ? !formIsValid.value : false
      }
    }

    return {
      ADDRESS,
      BUSINESS_NAME,
      HEADER,
      PERSON_NAME,
      changeType,
      emitValid,
      formIsValid,
      getFormClass,
      partyType,
      showBusinessName,
      showPersonName,
      updateAddress,
      updateBusiness,
      updatePerson
    }
  }
})
</script>

<!-- must be unscoped to hide the radio button circles -->
<style lang="scss">
@import "../assets/styles/theme.scss";

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

.v-item--active {
  border: 1px solid $BCgovGold5;
}
</style>
