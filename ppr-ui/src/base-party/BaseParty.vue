<template>
  <v-card flat>
    <v-form @input="formValid($event)">
      <v-radio-group
        v-if="editing"
        v-model="partyType"
        row
      >
        <v-radio
          class="filter-button"
          data-test-id="BaseParty.radio.business"
          label="Business"
          value="business"
          @change="changeType('business')"
        />
        <v-radio
          class="filter-button"
          data-test-id="BaseParty.radio.person"
          label="Person"
          value="person"
          @change="changeType('person')"
        />
      </v-radio-group>
      <business-name
        v-show="partyType === 'business'"
        data-test-id="BaseParty.business"
        :editing="editing"
        :value="value.businessName"
        @input="updateBusiness($event)"
        @valid="formValid($event)"
      />
      <person-name
        v-show="partyType === 'person'"
        data-test-id="BaseParty.person"
        :editing="editing"
        :value="value.personName"
        @input="updatePerson($event)"
        @valid="formValid($event)"
      />
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'

import PersonName from '@/components/PersonName.vue'
import { BasePartyModel } from '@/base-party/base-party-model'
import { BusinessModel } from '@/components/business-model'
import { PersonNameModel } from '@/components/person-name-model'

import BusinessName from '@/components/BusinessName.vue'

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

    const partyType = ref('business')

    // Callback function for emitting the model change back to the parent.
    function updateBusiness(newValue: BusinessModel): void {
      emit('input', new BasePartyModel(
        newValue,
        props.value.personName
      ))
    }

    // Callback function for emitting the model change back to the parent.
    function updatePerson(newValue: PersonNameModel): void {
      emit('input', new BasePartyModel(
        props.value.businessName,
        newValue
      ))
    }

    function changeType(type: string) {
      partyType.value = type
      switch (type) {
        case 'business':
          updatePerson(new PersonNameModel())
          break
        case 'person':
          updateBusiness(new BusinessModel())
          break
      }
    }

    // Callback function for emitting Person validity back to the parent.
    function formValid(valid: boolean) {
      emit('valid', valid)
    }

    return {
      changeType,
      formValid,
      partyType,
      updateBusiness,
      updatePerson
    }
  }
})
</script>

<style lang="scss" scoped>
.filter-button {
  border: 1px solid black;
  width: 20%;
}

.v-item--active {
  border: 1px solid red;
}
</style>
