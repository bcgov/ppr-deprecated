<template>
  <div>
    <v-container class="view-container">
      <article id="mockSerachResultsPage">
        <header>
          <h1>Personal Property Registry</h1>
        </header>
        <section>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum."
          </p>
        </section>
        <section>
          <header>
            <h2>Results for your search of Personal Property Registry</h2>
          </header>
          <p>
            Search terms: {{ terms }}
          </p>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    Calories
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in results"
                  :key="item.name"
                >
                  <td>{{ item.name }}</td>
                  <td>{{ item.calories }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </section>
      </article>
    </v-container>
  </div>
</template>

<script lang="ts">
import {createComponent, reactive, ref} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/ts-api/component"
import {useRouter} from '@/router/router'

export default createComponent({
  setup(): Data {
    const {route} = useRouter()
    const terms = ref<string>(route.params.terms)
    const results = reactive([
      {
        name: 'Frozen Yogurt',
        calories: 159,
      },
      {
        name: 'Ice cream sandwich',
        calories: 237,
      },
      {
        name: 'Eclair',
        calories: 262,
      },
      {
        name: 'Cupcake',
        calories: 305,
      },
      {
        name: 'Gingerbread',
        calories: 356,
      },
      {
        name: 'Jelly bean',
        calories: 375,
      },
      {
        name: 'Lollipop',
        calories: 392,
      },
      {
        name: 'Honeycomb',
        calories: 408,
      },
      {
        name: 'Donut',
        calories: 452,
      },
      {
        name: 'KitKat',
        calories: 518,
      }])

    return {
      results,
      terms,
    }
  }
})
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/theme.scss';

  article {
    .v-card {
      line-height: 1.2rem;
      padding: 1rem;
    }
  }

  section p {
    color: $gray6;
  }

  section + section {
    margin-top: 3rem;
  }

  h2 {
    margin-bottom: 0.25rem;
    margin-top: 3rem;
    font-size: 1.125rem;
  }
</style>
