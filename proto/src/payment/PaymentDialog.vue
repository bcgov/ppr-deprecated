<template lang="pug">
  dialog-confirm(
    :value="confirmDialogOpen",
    :title="title",
    :message="confirmPaymentMessage",
    :options="{ok:'Confirm', width:600}",
    @cancel="confirmCanceled($event)",
    @ok="confirmConfirmed($event)"
    )

</template>

<script lang="ts">
  import {computed, createComponent, ref, watch} from '@vue/composition-api'
  import { usePaymentSystem } from '@/payment/payment-system'
  import { useUsers, Roles } from '@/users/users'
  import DialogConfirm from "@/components/DialogConfirm.vue"

  export default createComponent({
    components: {DialogConfirm},
    props: {
      open: {
        default: false
      },
      title: {
        required: true,
        type: String
      },
      paymentCode: {
        required: true,
        type: String
      },
      quantity: {
        required: true,
        type: String
      }
    },
    setup(props, { emit }) {

      const { confirmDialogOpen, confirmCanceled, confirmConfirmed, confirmPaymentMessage, onOpen } = usePayDialog(props, emit)

      return {
        confirmDialogOpen, confirmCanceled, confirmConfirmed, confirmPaymentMessage, onOpen
      }
    }
  })

  function usePayDialog(props, emit) {
    const confirmDialogOpen = ref<boolean>(false)

    const amount = computed(() => {
      const code = props.paymentCode
      let amount = parseInt(props.quantity)
      if (code === "REGISTER")
        amount *= 5
      if (code === "SEARCH")
        amount *= 7
      return '' + amount
    })

    const confirmPaymentMessage = computed((): string => {
      const code = props.paymentCode
      let message = ''
      if (code === "REGISTER")
        message = `The cost to perform a PPR search is $${amount.value}.`
      if (code === "SEARCH")
        message = `To register this lien you need to pay $${amount.value}.`

      return `${message}  Do you wish to proceed?.`
    })

    function confirmCanceled() {
      confirmDialogOpen.value = false
      emit('cancel')
    }

    function confirmConfirmed() {
      const { paymentDo } = usePaymentSystem()
      const code = props.paymentCode
      const quantity = props.quantity
      const folio = "TO DO add folio"
      const payId = paymentDo(amount.value, code, folio, quantity)
      confirmDialogOpen.value = false
      emit('proceed', payId)
    }

    function onOpen() {
      const { currentRole } = useUsers()
      const mustPay = (currentRole.value !== Roles.Staff)
      if(mustPay) {
        confirmDialogOpen.value = true
      } else {
        emit('proceed')
      }
    }
    watch(() => {
      // watch for change of property coming from parent
      if(props.open) {
        onOpen()
      }
    });

    return {
      confirmDialogOpen, confirmCanceled, confirmConfirmed, confirmPaymentMessage, onOpen
    };
  }



</script>


<style lang="scss" scoped>
</style>
