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
        <p>
          Need copy here to instruct user as to how to create a financing statement.
          This is a development only form and view. Future development will include; debtors, collateral, and secured parties
        </p>
        <section>
          <p>Insert form here</p>
        </section>
      </article>
    </v-container>
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

export default createComponent({

  setup() {
    return {
    }
  }
})
</script>
