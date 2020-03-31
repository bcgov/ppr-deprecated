<template lang="pug">
  div
    h1 Register a Lien
    p.
      A lien is ....Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
      minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    v-simple-table(v-if="editing")
      thead
        tr
          th Type of Lien
          th Legislation
          th Condition
      tbody
        tr
          td Security Aggreement
          td PPS Act
          td blah blah
        tr
          td Security Aggreement
          td PPS Act
          td blah blah
        tr
          td Security Aggreement
          td PPS Act
          td blah blah

</template>

<script>
  import { createComponent, computed } from '@vue/composition-api'
  import { usePartyCodes, PartyCodeInterface } from '@/party-code/party-code-model'
  import { SecuredPartyModel } from '@/secured-parties/secured-party-model.ts'
  import ClientCode from '@/client-code/ClientCode.vue'

export default createComponent({
    props: {
      editing: {
        default: false,
        required: false,
        type: Boolean
      }
    },
    setup({}) {
      return {
      }
    }
  })
</script>

<style lang="scss" scoped>

.v-data-table {
  th {
    background-color: #38598A;
    color: #F8F9FA  !important;
    font-weight: bolder;
    font-size: 1.5rem;
  }

  th, td {
    border: 0.5px dotted darkgrey;
  }
  tbody tr:nth-of-type(even) {
    background-color: rgba(0, 0, 0, .05);
  }
}
</style>
