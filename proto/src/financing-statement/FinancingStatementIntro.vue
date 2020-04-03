<template lang="pug">
  div
    h1 {{ title }}
    p.
      &nbsp;
    v-expansion-panels(v-if="editing")
      v-expansion-panel
        v-expansion-panel-header
          div(class="expansion-header-content") How do I register a lien?
        v-expansion-panel-content
          p.
            A lien is ....Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          v-simple-table
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
import { computed, createComponent } from '@vue/composition-api'
import { usePartyCodes, PartyCodeInterface } from '@/party-code/party-code-model'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'
import { SecuredPartyModel } from '@/secured-parties/secured-party-model.ts'

export default createComponent({
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    submitted:  {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: FinancingStatementModel
    }
  },
  setup(props) {
    const title = computed(() => {
      const view = 'View Lien #' + props.value.baseRegistrationNumber
      return props.editing ? 'Register a Lien' : (props.submitted ? 'Successful Registration' : view)
    })
    return {
      title
    }
  }
})
</script>

<style lang="scss" scoped>

.expansion-header-content {
  margin-left: 1rem;
}
.v-expansion-panel-header {
  padding: 0;
}
.v-data-table {
  th {
    background-color: #38598A;
    color: #F8F9FA  !important;
    font-weight: bolder;
    font-size: 1rem;
  }

  th, td {
    border: 0.5px dotted darkgrey;
  }
  tbody tr:nth-of-type(even) {
    background-color: rgba(0, 0, 0, .05);
  }
}
</style>
