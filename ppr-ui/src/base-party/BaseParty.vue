<template>
  <v-card flat>
    <v-form @input="validForm(HEADER, $event)">
      <v-radio-group
        v-if="editing"
        v-model="partyType"
        row
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
      <business-name
        v-if="showBusinessName"
        data-test-id="BaseParty.business"
        :editing="editing"
        :value="value.businessName"
        @input="updateBusiness($event)"
        @valid="validForm(BUSINESS_NAME, $event)"
      />
      <person-name
        v-if="showPersonName"
        data-test-id="BaseParty.person"
        :editing="editing"
        :value="value.personName"
        @input="updatePerson($event)"
        @valid="validForm(PERSON_NAME, $event)"
      />
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { computed, createComponent, ref } from '@vue/composition-api'
import BusinessName from '@/components/BusinessName.vue'
import PersonName from '@/components/PersonName.vue'
import { BasePartyModel } from '@/base-party/base-party-model'
import { BusinessNameModel } from '@/components/business-model'
import { PersonNameModel } from '@/components/person-name-model'

export default createComponent({
  components: { BusinessName, PersonName },

  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: BasePartyModel
    }
  },

  setup(props, { emit }) {

    const BUSINESS_NAME = 'businessName'
    const HEADER = 'header'
    const PERSON_NAME = 'personName'

    /*  Create a structure to hold the validation state of the various sections of the form.
    */
    const validationState = {}
    validationState[BUSINESS_NAME] = false
    validationState[HEADER] = false
    validationState[PERSON_NAME] = false

    // partyType tracks the active name. Start showing one model, say, the business name
    const partyType = ref(BUSINESS_NAME)

    // Callback function for emitting form validity on all sections back to the parent.
    function validForm(key: string, validElement: boolean) {
      validationState[key] = validElement
      let formValid = validationState[HEADER]
      if (partyType.value === BUSINESS_NAME) {
        formValid = formValid && validationState[BUSINESS_NAME]
      }
      if (partyType.value === PERSON_NAME) {
        formValid = formValid && validationState[PERSON_NAME]
      }
      emit('valid', formValid)
    }

    const showBusinessName = computed((): boolean => partyType.value === BUSINESS_NAME)
    const showPersonName = computed((): boolean => partyType.value === PERSON_NAME)

    // Callback function for emitting the business name model change back to the parent.
    function updateBusiness(newValue: BusinessNameModel): void {
      emit('input', new BasePartyModel(
        newValue,
        props.value.personName
      ))
    }

    // Callback function for emitting the person name model change back to the parent.
    function updatePerson(newValue: PersonNameModel): void {
      emit('input', new BasePartyModel(
        props.value.businessName,
        newValue
      ))
    }

    // Callback function for tracking the current name model.
    // Intentional side effect to clear the non-active model.
    function changeType(type: string) {
      partyType.value = type
      switch (type) {
        case BUSINESS_NAME:
          // Activating the business name component so reset person to empty
          updatePerson(new PersonNameModel())
          break
        case PERSON_NAME:
          // Activating the person name component so reset business to empty
          updateBusiness(new BusinessNameModel())
          break
      }
    }

    return {
      BUSINESS_NAME,
      HEADER,
      PERSON_NAME,
      changeType,
      partyType,
      showBusinessName,
      showPersonName,
      updateBusiness,
      updatePerson,
      validForm
    }
  }
})
</script>

<style lang="scss" scoped>
@import "../assets/styles/theme.scss";

/* Very preliminary styling of the radio buttons.  This is very temporary */
.filter-button {
  border: 1px solid black;
  width: 20%;
}

.v-item--active {
  border: 1px solid $BCgovGold5;
}
</style>
