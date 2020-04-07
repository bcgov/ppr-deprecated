
<template lang="pug">
  v-tabs(fixed-tabs, class="customDash")
    v-tab Registrations
    v-tab Searches
    v-tab Client Codes
    v-tab Drafts
    v-tab Payments
    v-tab-item
      v-card
        registrations-tab
    v-tab-item
      v-card
        searches-tab
    v-tab-item
      v-card
        client-codes-tab
    v-tab-item
      v-card
        drafts
    v-tab-item
      v-card
        payments-tab
</template>
<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { useUsers } from '@/users/users'
import ClientCodesTab from '@/dashboard/ClientCodesTab.vue'
import Drafts from '@/drafts/Drafts.vue'
import PaymentsTab from '@/payment/PaymentsTab.vue'
import RegistrationsTab from '@/dashboard/RegistrationsTab.vue'
import SearchesTab from '@/search/SearchesTab.vue'

export default createComponent({
  components: {
    ClientCodesTab,
    Drafts,
    PaymentsTab,
    RegistrationsTab,
    SearchesTab
  },
  setup() {
    const { authenticated, currentUser} = useUsers()

    return {authenticated, currentUser}
  }
})

</script>
<style lang="scss">
  .customDash {
    .v-item-group {
      background-color: #f1f3f5 !important;
    }
    .v-tab {
      background-color: #38598A !important;
      color: white !important;
      font-size: 1.1rem;
      margin-right: 1rem;
    }
    .v-tab--active {
      background-color: #E6EAF4 !important;
      color: #0d47a1 !important;
    }
    .v-data-table {
      th {
        background-color: #38598A;
        color: #F8F9FA  !important;
        font-weight: bolder;
        font-size: 1.5rem;
      }

      th, td {
        padding-bottom: 2rem;
        font-size: 1.0rem;
      }
      tbody tr:nth-of-type(even) {
        background-color: white;
      }
    }
  }
</style>
