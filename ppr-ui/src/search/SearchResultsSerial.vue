<template>
  <section>
    <header>
      <h2>Results for your search of Personal Property Registry</h2>
    </header>
    <p>
      Search terms: {{ terms }}
    </p>

    <v-simple-table id="srsBody">
      <thead>
        <tr>
          <th class="text-left">
            Match
          </th>
          <th class="text-left">
            Make
          </th>
          <th class="text-left">
            VIN
          </th>
          <th class="text-left">
            Year
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in results"
          :key="item.name"
        >
          <td>{{ item.exactMatch }}</td>
          <td>{{ item.make }}</td>
          <td>{{ item.vin }}</td>
          <td>{{ item.year }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </section>
</template>

<script lang="ts">
import { computed, createComponent } from "@vue/composition-api"
import { Data } from "@vue/composition-api/dist/ts-api/component"
import { useSearcherSerial } from '@/search/search-serial'

export default createComponent({
  setup(): Data {
    const searcherSerial = useSearcherSerial()
    const terms = computed(() => {
      return searcherSerial.term
    })
    const results = computed(() => {
      return searcherSerial.results
    })
    return {
      results,
      terms,
    }
  }
})
</script>
