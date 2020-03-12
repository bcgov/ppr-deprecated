<template>
  <v-card outlined>
    <v-form
      v-if="editing"
      @input="emitValidity($event)"
    >
      <v-container>
        <v-btn
          data-test-id="CollateralItems.generalCollateral.button.add"
          :disabled="editingGeneralCollateral"
          large
          outlined
          @click="setEditingGeneralCollateral(true)"
        >
          <v-icon>mdi-plus-circle-outline</v-icon>
          <span>Add General Collateral</span>
        </v-btn>
      </v-container>
      <v-container v-if="editingGeneralCollateral">
        <v-row>
          <v-col cols="11">
            <strong>Provide a description of the General Collateral and proceeds being claimed in accordance with the
              legislative requirements:</strong> (example: Fridges and Stoves. Proceeds: Accts receivable)
          </v-col>
          <v-col>
            <v-btn
              data-test-id="CollateralItems.generalCollateral.button.clear"
              icon
              color="red"
              @click="clearGeneralCollateral()"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <div>
          <v-textarea
            ref="generalCollateral"
            data-test-id="CollateralItems.generalCollateral.textarea"
            :value="value.generalCollateral"
            label="General Collateral"
            @blur="setEditingGeneralCollateral(false)"
            @input="updateGeneralCollateral($event)"
          />
        </div>
      </v-container>
      <v-container
        v-if="!editingGeneralCollateral && value.generalCollateral"
        @click="setEditingGeneralCollateral(true)"
      >
        <div>
          General Collateral:
        </div>
        <span data-test-id="CollateralItems.generalCollateral.readonly">
          {{ value.generalCollateral }}
        </span>
      </v-container>
    </v-form>
    <div v-else>
      <div>
        General Collateral:
      </div>
      <span data-test-id="CollateralItems.generalCollateral.display">
        {{ value.generalCollateral }}
      </span>
    </div>
  </v-card>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'

import { CollateralItemsModel } from '@/financing-statement/collateral-items-model'

export default createComponent({
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: CollateralItemsModel
    }
  },

  setup(props, context) {
    const editingGeneralCollateral = ref<boolean>(false)

    // Callback function for emitting form validity back to the parent.
    function emitValidity(formValid: boolean) {
      context.emit('valid', formValid)
    }

    // Callback function for emitting model change of a string property.
    function setEditingGeneralCollateral(value: boolean): void {
      editingGeneralCollateral.value = value

      if (value) {
        // TODO: the textarea should receive the focus, but the following do not work for selecting the textarea.

        // Best:
        // context.root.$refs['generalCollateral'])
        // context.root.$root.$refs['generalCollateral'])

        // OK:
        // context.root.$el.querySelector('textarea'))
        // context.root.$root.$el.querySelector('textarea'))

        // Yuck:
        // context.root.$el.querySelector('[data-test-id="CollateralItems.input.generalCollateral"]'))
        // context.root.$root.$el.querySelector('[data-test-id="CollateralItems.input.generalCollateral"]'))
      }
    }

    // Callback function for emitting model change of the general collateral portion of th value property.
    function updateGeneralCollateral(generalCollateral: string): void {
      context.emit('input', new CollateralItemsModel(props.value.serialCollateral, generalCollateral)
      )
    }

    // Callback function for emitting model change of a string property.
    function clearGeneralCollateral(): void {
      updateGeneralCollateral('')
      setEditingGeneralCollateral(false)
    }

    return {
      clearGeneralCollateral,
      editingGeneralCollateral,
      emitValidity,
      setEditingGeneralCollateral,
      updateGeneralCollateral,
    }
  }
})
</script>
