<template>
  <v-app
    id="app"
    class="app-container, theme--light"
  >
    <component :is="DefaultLayout">
      <router-view :key="$route.fullPath" />
    </component>
  </v-app>
</template>

<script lang="ts">
import { createComponent, onErrorCaptured, onMounted } from '@vue/composition-api'
import { useUsers } from '@/users/users'

const DefaultLayout = 'public-layout'

export default createComponent({
  components: {
  },
  setup() {
    // const layout = computed((): string => (root.$router.currentRoute.meta.layout || DefaultLayout) + '-layout')
    const { setUser, restoreUserFromStash } = useUsers()

    onErrorCaptured((err): void => {
      console.log('App captured error', err)
    })

    onMounted(() => {
      restoreUserFromStash()
    })

    return { DefaultLayout }
  }
})

</script>
