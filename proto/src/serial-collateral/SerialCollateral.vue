<template>
  <v-form @input="validForm($event)">
    <v-container>
      <div v-if="editing">
        <v-select
          data-test-id="SerialCollateral.input.type"
          :items="serialCollateralTypes"
          :rules="typeRules"
          :value="value.type"
          label="Type"
          @input="updateType($event)"
        />
        <v-text-field
          v-if="!typeIsManufacturedHome"
          data-test-id="SerialCollateral.input.make"
          :rules="makeRules"
          :value="value.make"
          label="Make"
          @input="updateStringProperty('make', $event)"
        />
        <v-text-field
          v-if="!typeIsManufacturedHome"
          data-test-id="SerialCollateral.input.model"
          :rules="modelRules"
          :value="value.model"
          label="Model"
          @input="updateStringProperty('model', $event)"
        />
        <v-text-field
          v-if="!typeIsManufacturedHomeRegistered"
          data-test-id="SerialCollateral.input.serial"
          :rules="serialRules"
          :value="value.serial"
          :label="serialLabel"
          @input="updateStringProperty('serial', $event)"
        />
        <v-text-field
          v-if="!typeIsManufacturedHome"
          data-test-id="SerialCollateral.input.year"
          :rules="yearRules"
          :value="value.year"
          label="Year"
          @input="updateYear($event)"
        />
        <v-text-field
          v-if="typeIsManufacturedHomeRegistered"
          data-test-id="SerialCollateral.input.manufacturedHomeRegNumber"
          :rules="manufacturedHomeRegNumberRules"
          :value="value.manufacturedHomeRegNumber"
          label="Manufactured Home Registration Number"
          @input="updateStringProperty('manufacturedHomeRegNumber', $event)"
        />
      </div>

      <div v-else>
        <div v-if="layout==='minimal'" style="display:inline">
          <div>
            {{ minimalCollateral }}
          </div>
        </div>
        <div v-else>
          <div>
            Type:
            <span data-test-id="SerialCollateral.display.type">
              {{ value.type }}
            </span>
          </div>
          <div v-if="!typeIsManufacturedHome">
            Make:
            <span data-test-id="SerialCollateral.display.make">
              {{ value.make }}
            </span>
          </div>
          <div v-if="!typeIsManufacturedHome">
            Model:
            <span data-test-id="SerialCollateral.display.model">
              {{ value.model }}
            </span>
          </div>
          <div v-if="!typeIsManufacturedHomeRegistered">
            {{ serialLabel }}:
            <span data-test-id="SerialCollateral.display.serial">
              {{ value.serial }}
            </span>
          </div>
          <div v-if="!typeIsManufacturedHome">
            Year:
            <span data-test-id="SerialCollateral.display.year">
              {{ value.year }}
            </span>
          </div>
          <div v-if="typeIsManufacturedHomeRegistered">
            Manufactured Home Registration Number:
            <span data-test-id="SerialCollateral.display.manufacturedHomeRegNumber">
              {{ value.manufacturedHomeRegNumber }}
            </span>
          </div>
        </div>
      </div>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { computed, createComponent, ref } from '@vue/composition-api'

import { SerialCollateralModel } from '@/serial-collateral/serial-collateral-model'
import { SerialCollateralType, serialCollateralTypeCodeList } from '@/serial-collateral/serial-collateral-type'

export default createComponent({
  props: {
    layout: {
      default: 'full',
      required: false,
      type: String
    },
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    value: {
      required: true,
      type: SerialCollateralModel
    }
  },

  setup(props, { emit }) {
    const serialCollateralTypes = ref<string[]>(serialCollateralTypeCodeList)

    const makeRules = [
      (value: string): (boolean | string) => {
        return !!value || 'Make is required'
      }
    ]

    const manufacturedHomeRegNumberRules = [
      (value: string): (boolean | string) => {
        return !!value || 'Manufactured Home Registration Number is required'
      },
      (value: string): (boolean | string) => {
        return value && value.length <= 7 ? true :
          'Manufactured Home Registration Number cannot be longer than 7 characters'
      }
    ]

    const modelRules = [
      (value: string): (boolean | string) => {
        return !!value || 'Model is required'
      }
    ]

    const serialRules = [
      (value: string): (boolean | string) => {
        return !!value || 'Serial is required'
      },
      (value: string): (boolean | string) => {
        return value && value.length <= 25 ? true : 'Serial cannot be longer than 25 characters'
      }
    ]

    const typeRules = [
      (value: string): (boolean | string) => {
        return !!value || 'Type is required'
      }
    ]

    const yearRules = [
      (value: string): (boolean | string) => {
        return !!value || 'Year is required'
      },
      (value: string): (boolean | string) => {
        return Number(value) >= 1000 && Number(value) <= 9999 ? true : 'Year must be a number between 1000 and 9999'
      }
    ]

    // Convenience computed value for the type being a manufactured home not registered in B.C.
    const typeIsManufacturedHomeNotRegistered = computed((): boolean => {
      return props.value.type === SerialCollateralType.MANUFACTURED_HOME_NOT_REGISTERED
    })

    // Convenience computed value for the type being a manufactured home registered in B.C.
    const typeIsManufacturedHomeRegistered = computed((): boolean => {
      return props.value.type === SerialCollateralType.MANUFACTURED_HOME_REGISTERED
    })

    // Convenience computed value for the type being a manufactured home, whether or not registered in B.C.
    const typeIsManufacturedHome = computed((): boolean => {
      return typeIsManufacturedHomeNotRegistered.value || typeIsManufacturedHomeRegistered.value
    })

    // Convenience computed value for the serial number label. It has a special value for airframes.
    const serialLabel = computed((): string => {
      let label: string

      switch (props.value.type) {
        case SerialCollateralType.AIRCRAFT:
        case SerialCollateralType.AIRCRAFT_FRAME:
          label = 'DOT Number'
          break

        default:
          label = 'Serial Number'
      }

      return label
    })

    // Callback function for emitting form validity back to the parent.
    function validForm(formValid: boolean) {
      emit('valid', formValid)
    }

    // Callback function for emitting model change of a string property.
    function updateStringProperty(propertyName: string, value: string): void {
      const newSerialCollateralModel = props.value.toJson()

      // The switch statement has to do with being able to ensure that the propertyName can be checked for existence
      // at compile/linting time.
      switch (propertyName) {
        case 'make':
        case 'manufacturedHomeRegNumber':
        case 'model':
        case 'serial':
          newSerialCollateralModel[propertyName] = value
      }

      emit('input', SerialCollateralModel.fromJson(newSerialCollateralModel))
    }

    // Callback function for emitting model changes made to the Serial Collateral Type.
    function updateType(newType: SerialCollateralType): void {
      const newSerialCollateralModel = props.value.toJson()
      newSerialCollateralModel.type = newType

      emit('input', SerialCollateralModel.fromJson(newSerialCollateralModel))
    }

    // Callback function for emitting model changes made to the year.
    function updateYear(newYear: number): void {
      const newSerialCollateralModel = props.value.toJson()
      newSerialCollateralModel.year = newYear

      emit('input', SerialCollateralModel.fromJson(newSerialCollateralModel))
    }

    const minimalCollateral = computed(() => {
      const gc = props.value
      return gc.serial && gc.serial.length > 0 ? gc.serial : ''
    })

    return {
      makeRules,
      manufacturedHomeRegNumberRules,
      minimalCollateral,
      modelRules,
      serialCollateralTypes,
      serialLabel,
      serialRules,
      typeIsManufacturedHome,
      typeIsManufacturedHomeNotRegistered,
      typeIsManufacturedHomeRegistered,
      typeRules,
      updateStringProperty,
      updateType,
      updateYear,
      validForm,
      yearRules
    }
  }
})
</script>
