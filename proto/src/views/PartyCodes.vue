<template lang="pug">
  div
    v-container(class="view-container")
      article
        header
          h1 Party Codes

        div(class="page-content")
          div(class="page-content__main")
            party-code(v-for="party in partyList", :value="party", class="party-code")

</template>
<script lang="ts">
  import { createComponent } from '@vue/composition-api'
  import { usePartyCodes } from '../party-code/party-code-model'
  import PartyCode from '@/party-code/PartyCode.vue'
  export default createComponent({
    components: { PartyCode },
    setup(_, { root }) {
      const { partyList } = usePartyCodes()

      return {partyList}
    }
  })

</script>


<style lang="scss" scoped>
  @import '../assets/styles/theme.scss';
  .party-code {
    margin: 1rem 0;
  }
</style>
