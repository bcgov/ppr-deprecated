<template>
  <div>
    <v-container class="view-container">
      <article id="mockSearchPage">
        <header>
          <h1>Personal Property Registry</h1>
        </header>
        <section>
          <p>
            "Lorem {{ serialNumber }} ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum."
          </p>
        </section>
        <section>
          <header>
            <h2>Search the Personal Property Registry</h2>
          </header>
          <v-card flat>
            <v-text-field
              v-model="serialNumber"
              label="Serial number"
              hint="We can provide a helpful hint here ..."
              :rules="serialNumberRules"
              required
            />
            <v-btn
              id="serach-btn"
              color="primary"
              :disabled="!formValid"
              @click="doSearch"
            >
              Search
            </v-btn>
          </v-card>
        </section>
      </article>
    </v-container>
  </div>
</template>

<script lang="ts">
import {computed, createComponent, reactive, ref} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/ts-api/component"
import {useStore} from "@/store"
import {useRouter} from '@/router/router'


export default createComponent({
  setup(): Data {
    const {store} = useStore()
    const {router} = useRouter()

    const serialNumber = ref<string>('')

    const formValid = computed(() => {
      return true
    })

    const serialNumberRules = reactive([
      v => !!v || 'Serial number is required'
      // , v => /^\d{9}$/.test(v) || 'serial number must be 9 digits'
    ])

    function doSearch() {
      console.log('Search for ', serialNumber.value)
      store.dispatch('setLoading', true)
      setTimeout( () => {
        store.dispatch('setLoading', false)
        router.push({ name: 'results', params: {terms: serialNumber.value }})
      },
      3000)
    }

    return {
      doSearch,
      formValid,
      serialNumber,
      serialNumberRules
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
