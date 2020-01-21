<template>
  <v-card flat>
    <v-form v-model="formValid">
      <v-text-field
        id="search"
        v-model="searchTerm"
        :hint="hint"
        :label="label"
        :rules="rules"
        required
      />
      <v-btn
        id="search-btn"
        color="primary"
        :disabled="!formValid"
        @click="search"
      >
        Search
      </v-btn>
      <v-banner
        v-show="errorMessage"
        id="errorMessage"
        single-line
      >
        {{ errorMessage }}
      </v-banner>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import { Data } from '@vue/composition-api/dist/ts-api/component'

export default createComponent({
  props: {
    errorMessage: String,
    hint: String,
    label: String,
    rules: Array
  },

  setup(props, { emit }): Data {
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

<style lang="scss" scoped>
</style>
