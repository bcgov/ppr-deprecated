<template lang="pug">
  v-form
    v-list
      ppr-list-item(
        v-for="(collateral, index) in value",
        :key="collateral.listId",
        class="list-item",
        :editing="editing"
      )
        template(#header) Enter the general collateral description

        general-collateral(
          :value="collateral",
          :editing="editing",
          prompt="Describe",
          @input="updateElement($event, index)",
          @valid="emitValidity($event, index)"
        )
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import { GeneralCollateralModel } from '@/general-collateral/general-collateral-model'
import GeneralCollateral from '@/general-collateral/GeneralCollateral.vue'
import PprListItem from '../components/PprListItem.vue'
/*
The general collateral list contains just one element when initially registering a form.  Later after
there are amendments the list contains successive new elements.

TODO  connect with serial collateral. User can remove a general collateral during edit if they have a serial collateral item, and vice versa
 */
export default createComponent({
  components: {
    GeneralCollateral,
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
      type: Array // a list of general collaterals
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

    // Vue is not able to detect changes inside arrays so when emitting the array
    // be sure to clone the array.
    function updateElement(newParty: GeneralCollateralModel, index: number): void {
      let sp = [...props.value]
      const previous: GeneralCollateralModel = props.value[index] as GeneralCollateralModel
      newParty.listId = previous.listId
      sp[index] = newParty
      emit('input', sp)
    }

    return {
      emitValidity,
      formIsValid,
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
