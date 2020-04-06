<template lang="pug">
  div
    v-btn(@click="toggle") Prototype To Do

    v-dialog(v-model="isOpen",:max-width="600")
      v-card
        v-card-title Prototype To Do
        v-card-text
          slot
        v-card-actions
          v-spacer
          v-btn(@click="close") Close
</template>


<script lang="ts">
import { createComponent,ref } from '@vue/composition-api'

export default createComponent({
  setup(props, { emit }) {
    const isOpen = ref(false)
    function toggle() {
      isOpen.value = !isOpen.value
    }
    function close() {
      isOpen.value = false
    }
    return {
      isOpen, toggle, close
    }
  }
})

</script>
