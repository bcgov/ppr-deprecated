<template>
  <v-dialog
    v-model="value"
    content-class="confirm-dialog"
    :max-width="dialogOptions.width"
    :style="{ zIndex: dialogOptions.zIndex }"
    :persistent="true"
    @keydown.esc="onClickCancel()"
  >
    <v-card>
      <v-card-title data-test-id="Confirm.title">{{ title }}</v-card-title>
      <v-card-text data-test-id="Confirm.message">{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-show="!!dialogOptions.ok"
          data-test-id="Confirm.button.ok"
          color="primary"
          text
          @click="onClickOk()"
        >
          {{ dialogOptions.ok }}
        </v-btn>
        <v-btn
          v-show="!!dialogOptions.cancel"
          data-test-id="Confirm.button.cancel"
          color="secondary"
          text
          @click="onClickCancel()"
        >
          {{ dialogOptions.cancel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'

interface DialgoConfirmOptionsInterface {
  width?: number | string;
  zIndex?: number;
  yes?: string;
  no?: string;
  cancel?: string;
}

export default createComponent({
  components: {},
  props: {
    title: {
      default: 'Confirm',
      required: false,
      type: String
    },
    message: {
      default: 'Confirm you wish to proceed.',
      required: false,
      type: String
    },
    options: {
      type: Object, // DialogConfirmOptionsInterface,
      required: false
    },
    value: {
      required: true,
      type: Boolean
    }
  },

  setup(props, { emit }) {
    const isOpen = ref(props.value)
    const defaults = {
      width: 400,
      zIndex: 200,
      ok: 'Yes',
      cancel: 'Cancel'
    }

    // Dialog controls. Blend the incoming properties with the defaults.
    const dialogOptions: DialgoConfirmOptionsInterface = props.options ? Object.assign(defaults, props.options) : defaults

    /**
     * Handler for OK button
     */
    function onClickOk(): void {
      emit("ok")
    }
    /**
       * Handler for Cancel button.
       */
    function onClickCancel(): void {
      emit('cancel')
    }

    return {
      dialogOptions,
      isOpen,
      onClickCancel,
      onClickOk
    }
  }
})

</script>
