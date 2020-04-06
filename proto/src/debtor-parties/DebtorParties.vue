<template lang="pug">
  v-form
    v-list
      ppr-list-item(
        v-for="(debtorParty, index) in value",
        :key="debtorParty.listId",
        class="list-item",
        :editing="editing",
        :index="index",
        :list-length="value.length",
        @remove="removeElement"
      )
        template(#header) Enter the contact information for this <strong>Debtor</strong>

        debtor-party(
          :value="debtorParty",
          :editing="editing",
          prompt="How should we identify this Debtor?",
          @input="updateElement($event, index)",
          @valid="emitValidity($event, index)"
        )
    div(v-if="editing",class="flex-center")
      v-btn(@click="addElement")
        span Add new Debtor
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import { DebtorModel } from '@/debtor-parties/debtor-model'
import DebtorParty from '../debtor-parties/DebtorParty.vue'
import PprListItem from '../components/PprListItem.vue'

export default createComponent({
  components: {
    DebtorParty,
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
    function updateElement(newParty: DebtorModel, index: number): void {
      let sp = [...props.value]
      const previous: DebtorModel = props.value[index] as DebtorModel
      newParty.listId = previous.listId
      sp[index] = newParty
      emit('input', sp)
    }

    function addElement() {
      let sp = [...props.value]
      const last: DebtorModel = props.value[props.value.length - 1] as DebtorModel
      const newParty = new DebtorModel()
      newParty.listId = last.listId + 1
      sp.push(newParty)
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

  .list-item {
    border-bottom: 1px dotted grey;
    margin: 0 !important;
    padding: 0 !important;
  }
</style>
