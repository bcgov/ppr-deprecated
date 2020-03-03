<template>
  <v-toolbar
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
<style lang="scss" scoped>
.v-toolbar {
  padding-top: 0.5em;
  border-top: 5px solid #003366;
}

.v-label {
  font-weight: bold;
  color: rgb(0, 0, 0, 0.8);
}
</style>
