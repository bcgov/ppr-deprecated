<template lang="pug">
  div
    party-code(v-for="party in partyList", :value="party", class="party-code")

</template>
<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { usePartyCodes } from '../party-code/party-code-model'
import PartyCode from '@/party-code/PartyCode.vue'
export default createComponent({
  components: { PartyCode },
  setup() {
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
