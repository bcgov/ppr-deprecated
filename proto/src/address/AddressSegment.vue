<template lang="pug">
  div(style="display:inline")
    v-form(v-if="editing", @input="emitValid($event)")
      v-row
        v-col
          v-text-field(label="Street",:value="value.street",@input="update('street', $event)")
      v-row
        v-col
          v-text-field(label="City",:value="value.city",@input="update('city', $event)")
        v-col
          v-text-field(label="Province",:value="value.province",@input="update('province', $event)")
      v-row
        v-col
          v-text-field(label="Country",:value="value.country",@input="update('country', $event)")
        v-col
          v-text-field(label="Postal",:value="value.postal",@input="update('postal', $event)")
    div(v-else) {{oneLine}}
</template>

<script lang="ts">
import { computed, createComponent } from '@vue/composition-api'
import { AddressModel } from '@/address/address-model'

export default createComponent({
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: AddressModel
    }
  },
  setup(props, { emit }) {
    const oneLine = computed(() => {
      const text = []
      props.value.street ? text.push(props.value.street) : undefined
      props.value.city ? text.push(props.value.city) : undefined
      props.value.province ? text.push(props.value.province) : undefined
      props.value.postal ? text.push(props.value.postal) : undefined
      props.value.country ? text.push(props.value.country) : undefined
      return text.join(', ')
    })
    function emitValid(valid: boolean) {
      emit('valid', true)
    }


    // TODO add validation
    // const streetRules = [
    //   (value: string): (boolean | string) => {
    //     return !!value || 'The Business Name is required'
    //   }
    // ]

    function update(key: string, name: string): void {
      const prev = props.value
      let newModel: AddressModel
      if (key === 'street') {
        newModel = new AddressModel(name, prev.city, prev.province, prev.postal, prev.country)
      }
      if (key === 'city') {
        newModel = new AddressModel(prev.street, name, prev.province, prev.postal, prev.country)
      }
      if (key === 'province') {
        newModel = new AddressModel(prev.street, prev.city, name, prev.postal, prev.country)
      }
      if (key === 'postal') {
        newModel = new AddressModel(prev.street, prev.city, prev.province, name, prev.country)
      }
      if (key === 'country') {
        newModel = new AddressModel(prev.street, prev.city, prev.province, prev.postal, name)
      }
      emit('input',newModel)
    }

    return {
      emitValid,
      oneLine,
      update
    }
  }
})
</script>

