<template lang="pug">
  div(style="display:inline")
    v-card(flat, v-if="editing")
      v-form(
        class="base-form",
        @input="emitValid($event)"
      )
        v-textarea(
            outlined=true,
            label="General Collateral",
            :value="value.description",
            @input="update($event)"
        )
    div(v-else, style="display:inline")
      div(v-if="layout==='minimal'",style="display:inline")
        div {{ minimalCollateral }}
      div(v-else)
        v-row
          v-col(cols="2")
              div Description:
          v-col(cols="3")
              div {{value.description}}
</template>

<script lang="ts">
import { computed, createComponent } from '@vue/composition-api'
import { GeneralCollateralModel } from '@/general-collateral/general-collateral-model'

export default createComponent({
  components: { },
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
      type: GeneralCollateralModel
    }
  },

  setup(props, { emit }) {

    function emitValid(validElement: boolean) {
      emit('valid', validElement)
    }

    function update (model: string) {
      emit('input',new GeneralCollateralModel(model))
    }

    const minimalCollateral = computed(() => {
      let rval =''
      const max = 50
      const gc = props.value
      if(gc.description > 0) {
        rval = gc.description
        rval = rval.length > max ? rval.substring(max) + '...' : rval
        }
      return rval
    })

    return {
      emitValid,
      minimalCollateral,
      update
    }
  }
})

</script>

<!-- must be unscoped to hide the radio button circles -->
<style lang="scss">
@import "../assets/styles/theme.scss";

.ppr-col {
  padding: 3px !important;
  margin: 0 !important;
}
.col {
  padding: 3px !important;
  margin: 0 !important;
}
.row {
  margin: 0 !important;
}


.section {
  font-weight: bold;
}
.flex-center {
  align-items: center;
  display: flex;
  flex-direction: column;
  padding-top: 0;
}

.base-form {
  padding: 1rem;
}

.filter-button {
  border: 1px solid black;
  padding-right: 2rem;
  .v-icon {
    display: none;
    visibility: hidden;
  }
}

.v-text-field {
  margin: 0;
  padding: 0;
}
.v-item--active {
  border: 1px solid $BCgovGold5;
}
</style>
