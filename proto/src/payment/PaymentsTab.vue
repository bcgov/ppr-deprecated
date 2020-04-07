<template lang="pug">
  v-simple-table
    tbody
      tr(v-for="record in paymentRecordList")
        td
          v-row
            v-col(cols="2")
              div {{record.code}}
            v-col(cols="2")
              div {{record.quantity}}
            v-col(cols="2")
              div {{record.amount}}
            v-col(cols="2")
              div {{ record.date }}
            v-col(cols="2")
              div {{ record.folio }}
            v-col(cols="2")
              div {{ record.id }}

</template>
<script lang="ts">
  import { computed, createComponent } from '@vue/composition-api'
  import { usePaymentSystem } from '@/payment/payment-system'

export default createComponent({
  components: {
  },
  setup(_, {root}) {
    const { paymentGetUserList } = usePaymentSystem()

    const paymentRecordList = computed(() => paymentGetUserList() )

    return {
      paymentRecordList
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
