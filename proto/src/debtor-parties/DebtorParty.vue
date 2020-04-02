<template lang="pug">
  div
    v-form(
      v-if="editing",
      :class="getFormClass()",
      class="base-party-form",
      data-test-id="BaseParty.form",
      @input="emitValidity(HEADER, $event)"
    )
      business-name(
        :editing="editing",
        :value="value.businessName",
        @input="updateBusiness($event)",
        @valid="emitValidity(BUSINESS_NAME, $event)",
      )
      person-name(
        :editing="editing",
        :value="value.personName",
        @input="updatePerson($event)",
        @valid="emitValidity(PERSON_NAME, $event)"
      )
    div(v-else)
      div(v-if="layout=='condensed'")
        div(v-if="value.businessName")
          div(class="section") Business Name
          business-name(:value="value.businessName")
        div(v-if="personName") "{{personName}}"
          div(class="section") Individual Name
          person-name(:value="personName")
      div(v-if="layout=='minimal'")
        div(v-if="value.businessName")
          business-name(:value="value.businessName")
        div(v-if="personName") "{{personName}}"
          person-name(:value="personName")
      div(v-else)
        div(v-if="value.businessName")
          div(class="section") Business Name
          business-name(:value="value.businessName")
        div(v-if="personName") "{{personName}}"
          div(class="section") Individual Name
          person-name(:value="personName")
        // insert address here
</template>

<script lang="ts">
import { computed, createComponent, ref } from '@vue/composition-api'
import BusinessName from '@/business-name/BusinessName.vue'
import PersonName from '@/person-name/PersonName.vue'
import { BasePartyModel } from '@/base-party/base-party-model'
import { BusinessNameModel } from '@/business-name/business-name-model'
import { PersonNameModel } from '@/person-name/person-name-model'

export default createComponent({
  components: { BusinessName, PersonName },

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
      type: BasePartyModel
    }
  },

  setup(props, { emit }) {

    const formIsValid = ref<boolean>(false)

    const BUSINESS_NAME = 'businessName'
    const HEADER = 'header'
    const PERSON_NAME = 'personName'

    /*  Create a structure to hold the validation state of the various sections of the form.
    */
    interface StringKeyedObject {
      [index: string]: boolean;
    }
    const validationState: StringKeyedObject = {}
    validationState[BUSINESS_NAME] = false
    validationState[HEADER] = false
    validationState[PERSON_NAME] = false

    let type = (props.value.personName.first || props.value.personName.last) ? PERSON_NAME : BUSINESS_NAME
    // partyType tracks the active name. Start showing one model, say, the business name
    const partyType = ref(type)

    // Callback function for emitting form validity on all sections back to the parent.
    function emitValidity(key: string, validElement: boolean) {
      validationState[key] = validElement
      let formValid = validationState[HEADER]
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

    const personName = computed((): string => {
      const parts: string[] = []
      props.value.personName.first ? parts.push(props.value.personName.first) : undefined
      props.value.personName.middle ? parts.push(props.value.personName.middle) : undefined
      props.value.personName.last ? parts.push(props.value.personName.last) : undefined
      return parts.join(',')
    })

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
      BUSINESS_NAME,
      HEADER,
      PERSON_NAME,
      changeType,
      formIsValid,
      getFormClass,
      partyType,
      personName,
      showBusinessName,
      showPersonName,
      updateBusiness,
      updatePerson,
      emitValidity
    }
  }
})
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

.v-item--active {
  border: 1px solid $BCgovGold5;
}
</style>
