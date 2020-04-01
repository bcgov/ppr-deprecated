<template lang="pug">
  div
    v-row
      v-col(cols="12",sm="4")
        v-card(class="pa-2",outlined)
          div Type: {{ draft.type }}
          div Name: {{ draft.name }}
      v-col(cols="12",sm="4")
        v-card(class="pa-2",outlined)
          div Date Created: {{ draft.created }}
          div Last Modified: {{ draft.last }}
      v-col(cols="12",sm="4")
        v-card(class="pa-2",outlined)
          v-btn(icon,color="red")
            v-icon mdi-close-circle-outline
            span Delete draft
    v-row
      v-col(cols="12",sm="4")
        v-card(class="pa-2",outlined)
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
