<template lang="pug">
  v-form
    v-list
      ppr-list-item(
        v-for="(securedParty, index) in value",
        :key="securedParty.listId",
        :editing="editing",
        :index="index",
        :list-length="value.length",
        @remove="removeElement"
      )
        template(#header) Select a client for this <strong>Secured Party</strong>
        secured-party(
          :value="securedParty",
          :editing="editing",
          :layout="editing ? 'full' : 'minimal'",
          @input="updateElement($event, index)",
          @valid="emitValidity($event, index)"
        )
    v-container(v-if="editing",class="flex-center")
      v-btn(@click="addElement")
        span Add new secured party
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import { SecuredPartyModel } from '@/secured-parties/secured-party-model.ts'
import SecuredParty from '@/secured-parties/SecuredParty.vue'
import FormSectionHeader from '@/components/FormSectionHeader.vue'
import PprListItem from '@/components/PprListItem.vue'

export default createComponent({
  components: {
    SecuredParty,
    FormSectionHeader,
    PprListItem
  },
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: Array // a list of parties
    }
  },

  setup(props, { emit }) {

    const formIsValid = ref<boolean>(false)

    // Create a structure to hold the validation state of the elements of the list
    // TODO consider if this needs to be reactive
    const validationState: boolean[] = new Array(props.value.length).fill(false)

    // Callback function for emitting form validity on the header section back to the parent.
    function emitValidity(validElement: boolean, index: number) {
      // save the validity of the element
      validationState[index] = validElement
      // Search the array for any false values. Note that 'find' returns undefined when all values are 'true'.
      const notValid = validationState.includes(false)
      formIsValid.value = !notValid
      emit('valid', formIsValid.value)
    }

    // Vue is not able to detect changes inside arrays so when emitting the array of parties
    // be sure to clone the array.
    function updateElement(newSecuredParty: SecuredPartyModel, index: number): void {
      let sp = [...props.value]
      const previous: SecuredPartyModel = props.value[index] as SecuredPartyModel
      newSecuredParty.listId = previous.listId
      sp[index] = newSecuredParty
      emit('input', sp)
    }

    function addElement() {
      let sp = [...props.value]
      const last: SecuredPartyModel = props.value[props.value.length - 1] as SecuredPartyModel
      const newSecuredParty = new SecuredPartyModel()
      newSecuredParty.listId = last.listId + 1
      sp.push(newSecuredParty)
      emit('input', sp)
    }

    function removeElement(index: number) {
      let sp = [...props.value]
      sp.splice(index, 1)
      emit('input', sp)
    }

    return {
      addElement,
      emitValidity,
      formIsValid,
      removeElement,
      updateElement
    }
  }
})
</script>

<style lang="scss" scoped>
.flex-center {
  align-items: center;
}
</style>
