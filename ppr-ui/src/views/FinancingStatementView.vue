<template>
  <div>
    <v-container class="view-container">
      <router-link to="home">
        Home
      </router-link>
    </v-container>
    <v-container class="view-container">
      <article id="financingStatement">
        <header>
          <h1>Create Financing Statement</h1>
        </header>
        <p>
          <em>Note: This web site is a work in progress.</em>
        </p>
        <v-btn
          text
          small
          @click="toggle()"
        >
          Toogle editing {{ editing }}
        </v-btn>
        <p>
          Need copy here to instruct user as to how to create a financing statement.
          This is a development only form and view. Future development will include; debtors, collateral, and secured parties
        </p>
        <section>
          <p>{{ financingStatement }} </p>
          <financing-statement
            v-model="financingStatement"
            :editing="editing"
          />
        </section>
      </article>
    </v-container>
  </div>
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
import FinancingStatement from '@/financing-statement/FinancingStatement.vue'
import { FinancingStatementModel } from '@/financing-statement/financing-statement-model'

export default createComponent({
  components: { FinancingStatement },

  setup() {

    const financingStatement = ref(new FinancingStatementModel())

    /*
    The display mode will be determined by the incoming URL. If the url contains a FS id then
    we'll set display mode true and perform an API GET to retrieve the FS details.  Otherwise,
    the display mode is false and we're going to build a new FS.

    This toggle button functionality is a placeholder for that future logic. We need this placeholder
    to develop and test the readonly version of the FS container and inner inputs.
    */
    const editing = ref(true)
    function toggle(): void {
      editing.value = !editing.value
    }

    return {
      editing,
      financingStatement,
      toggle
    }
  }
})
</script>
