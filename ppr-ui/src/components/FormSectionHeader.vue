<template>
  <v-toolbar
    color="grey lighten-3"
    dense
    flat
  >
    <v-label> {{ label }} </v-label>
  </v-toolbar>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

export default createComponent({
  props: {
    label: String
  }
})
</script>
