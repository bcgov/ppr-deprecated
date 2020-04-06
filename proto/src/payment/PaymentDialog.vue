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
      message: {
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
    const confirmDialogOpen = ref<>(false)

    const confirmPaymentMessage = computed((): string => {
      return `${props.message}  Do you wish to proceed?.`
    })

    function confirmCanceled() {
      confirmDialogOpen.value = false
      emit('cancel')
    }

    function confirmConfirmed() {
      confirmDialogOpen.value = false
      emit('proceed')
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
