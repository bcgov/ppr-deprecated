<template lang="pug">
  v-list
    ppr-list-item(v-for="(party, index) in partyList", :key="party.clientCode", :index="index", :list-length="partyList.length")
      party-code(:value="party", class="party-code")

</template>
<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { usePartyCodes } from '../party-code/party-code-model'
import PartyCode from '@/party-code/PartyCode.vue'
import PprListItem from '../components/PprListItem.vue'

export default createComponent({
  components: { PartyCode, PprListItem },
  setup() {
    const { partyList } = usePartyCodes()

    return {partyList}
  }
})
</script>


<style lang="scss" scoped>
  @import '../assets/styles/theme.scss';
  .party-code {
    margin: 0;
    border-bottom: 1px solid grey;
  }
</style>
