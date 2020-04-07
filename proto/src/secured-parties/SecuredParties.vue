<template lang="pug">
  v-form
    proto-to-do
      p.
        This tab lets the user determine who owns the lien. In older PPR systems these fields are free form
        and users can enter business or person names with addresses. In this prototype we show what it'd be like
        if the user is restricted to use pre-defined "client codes".  The name "client code" or "party code" comes
        from the code number used to identify the party in the older system.  In a newer system it's preferable to just
        use the business name in the lookahead.  Begs the question, what to call these.
      p.
        Once a user selects a secured party from the lookup list we must show the address.
        Also consider making it easy for the user to create a new "client code"
      p.
        The lookup id could be (should be?) stored in the financing statement.  This way the party record can be
        updated/corrected later. Or this way a Global Change of Registered Interest (GCRI) can be applied with consistency
        and certainty.  A GCRI is usefule when one secured party sells all their interests to another business entity.
      p.
        Question: should the client code be replace with a reference to the BC business (VON) registry?

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
import PprListItem from '@/components/PprListItem.vue'
import ProtoToDo from '@/components/ProtoToDo.vue'

export default createComponent({
  components: {
    SecuredParty,
    PprListItem, ProtoToDo
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
