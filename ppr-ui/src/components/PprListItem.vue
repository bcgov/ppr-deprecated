<template>
  <v-list-item
    three-line
    class="ppr-list-item"
  >
    <v-list-item-content>
      <v-list-item-title
        v-if="editing"
        data-test-id="ListItem.header.title"
        class="header"
      >
        <v-container>
          <v-row no-gutters>
            <v-col
              md10
              class="header-content"
            >
              <slot name="header" />
            </v-col>
            <v-col
              md2
              class="item-title"
              title="Remove"
            >
              <v-btn
                v-if="listLength >= 2"
                data-test-id="ListItem.button.remove"
                icon
                color="red"
                @click="remove(index)"
              >
                <v-icon>mdi-close-circle-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-list-item-title>
      <v-container class="item-content">
        <slot />
      </v-container>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

export default createComponent({
  props: {
    editing: {
      default: false,
      required: false,
      type: Boolean
    },
    listLength: {
      required: true,
      type: Number
    },
    index: {
      required: true,
      type: Number
    }
  },

  setup(_, { emit }) {

    function remove(index: number): void {
      emit('remove', index)
    }

    return {
      remove
    }
  }
})

</script>

<style lang="scss" scoped>
.header {
  padding-left: 1rem;
}
.header-content {
  padding-top: 1.5rem;
}
.item-content {
  margin-top: 0;
  padding-top: 0;
}

.v-list-item__content {
  padding-top: 0;
}
.item-title {
  justify-content: flex-end;
  margin-left: auto;
  flex: 0 1 10%;
}
</style>
