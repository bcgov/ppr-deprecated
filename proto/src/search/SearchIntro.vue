<template lang="pug">
  section
    v-expansion-panels
      v-expansion-panel
        v-expansion-panel-header
          div(class="expansion-header-content") How do I search the PPR?
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
                th Type of Search
                th Types of criteria
                th Types of results
            tbody
              tr
                td Base Registration Number
                td A registration number such as r1234567
                td The financing statement if the registration number is in the system
              tr
                td Serial Number
                td A VIN or partial VIN, or other serial number
                td.
                  You may see two lists. Exact matches contains all the registrations
                  that have serial collateral items that exactly match the criteria
                  The similar matches contains registrations that have serial collateral
                  items that share the last 6 characters
              tr
                td Debtor
                td Lorem ipsum dolor sit amet, consectetur adipiscing elit, ...
                td.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
</template>

<script>
import { createComponent } from '@vue/composition-api'

export default createComponent({
  props: {
  },
  setup() {
    return {
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
