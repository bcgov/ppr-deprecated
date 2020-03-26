<template>
  <div>
    <v-select
      :value="type"
      :items="fsTypes"
      data-test-id="FinancingStatement.type.select"
      label="Type"
      name="typeInput"
      @input="updateType"
    />
    <dialog-confirm
      :value="dialogOpen"
      title="Confirm"
      :message="typeChangeMessage"
      :options="{ok:'Confirm', width:600}"
      @cancel="typeChangeCanceled($event)"
      @ok="typeChangeConfirmed($event)"
    />
  </div>
</template>

<script lang="ts">
import { computed, createComponent, ref } from '@vue/composition-api'
import { FinancingStatementType } from '@/financing-statement/financing-statement-type'
import DialogConfirm from "@/components/DialogConfirm.vue"

export default createComponent({
  components: {
    DialogConfirm,
  },
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: String
    }
  },

  setup(props, { emit }) {

    // Create the set of text value pairs for the Type select
    interface SelectItem {
      text: string;
      value: string;
    }
    const fsTypes: SelectItem[] = []
    const fsTypeLabels: string[] = Object.values(FinancingStatementType)
    Object.keys(FinancingStatementType).forEach((key: string, index: number): void => {
      fsTypes.push({ text: fsTypeLabels[index], value: key })
    })

    // Controls dialog state.
    const dialogOpen = ref(false)

    // Ref to the incoming value. Need this to allow this component to modify
    // this value, in the case the user cancels the confirm.
    const type = ref(props.value)

    // Temporary storage for the time between user selects a value and the confirm
    // dialog displays the option and the possible confirmation emits the change
    // to the parent
    const typeStash = ref<FinancingStatementType>()

    const typeChangeMessage = computed((): string => {
      const label = FinancingStatementType[typeStash.value]
      return `Confirm change type from "${props.value}" to "${label}". WARNING! You may lose information you entered.`
    })

    /**
     * Callback to close the dialog and reset the original value into the select.
     */
    function typeChangeCanceled() {
      dialogOpen.value = false
      type.value = props.value
    }

    /**
     * Callback for the user confirming the change of type.
     */
    function typeChangeConfirmed() {
      dialogOpen.value = false
      emit('input', typeStash.value)
    }

    /**
     *  Callback function for emitting model changes made to the FS type; sends
     * the new type to the parent.
     */
    function updateType(newType: FinancingStatementType): void {
      typeStash.value = newType
      dialogOpen.value = true
    }

    return {
      dialogOpen,
      fsTypes,
      type,
      typeChangeCanceled,
      typeChangeConfirmed,
      typeChangeMessage,
      typeStash,
      updateType
    }
  }
})
</script>
