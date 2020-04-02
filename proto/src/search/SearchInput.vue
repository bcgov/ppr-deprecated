<template lang="pug">
  v-card(flat)
    v-form(v-model="formValid")
      v-text-field(
        id="search",
        v-model="searchTerm",
        :disabled="disabled",
        :hint="hint",
        :label="label",
        :rules="rules",
        required
      )
      v-btn(
        id="search-btn",
        color="primary",
        :disabled="!formValid || disabled",
        @click="search"
      ) Search
      v-banner(
        v-show="errorMessage",
        id="errorMessage",
        single-line
      ) {{ errorMessage }}
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'

export default createComponent({
  props: {
    disabled: Boolean,
    errorMessage: String,
    hint: String,
    label: String,
    rules: Array
  },

  setup(props, { emit }) {
    const searchTerm = ref<string>('')
    const formValid = ref<boolean>()

    function search(): void {
      emit('search', searchTerm.value)
    }

    return {
      search,
      searchTerm,
      formValid
    }
  }
})
</script>
