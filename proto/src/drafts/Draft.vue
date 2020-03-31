<template lang="pug">
  div
    v-row
      v-col(
        :key="1",
        cols="12",
        sm="4",
      )
        v-card(
          class="pa-2",
          outlined,
          tile
        )
          div Type: {{ draft.type }}
          div Name: {{ draft.name }}
      v-col(
      :key="2",
      cols="12",
      sm="4",
      )
        v-card(
        class="pa-2",
        outlined,
        tile
        )
          div Date Created: {{ draft.created }}
          div Last Modified: {{ draft.last }}
      v-col(
      :key="3",
      cols="12",
      sm="4",
      )
        v-card(
          class="pa-2",
          outlined
        )
          v-btn(
            icon,
            color="red"
              )
            v-icon mdi-close-circle-outline
            span Delete draft
    v-row
      v-col(
      cols="12",
      sm="12",
      )
        v-card(
        class="pa-2",
        outlined,
        tile
        )
          v-btn Edit draft


</template>
<script lang="ts">
  import { createComponent } from '@vue/composition-api'

  export default createComponent({
    components: {  },
    props: {
      draft: {
        required: true,
        type: Object
      }
    },
    setup() {
      return {}
    }
  })

</script>

<style lang="scss" scoped>
  .v-btn--icon.v-size--default {
    width: 10rem;
  }
  .v-card {
    border: none !important;
  }
</style>
