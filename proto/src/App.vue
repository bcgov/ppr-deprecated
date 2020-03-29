<template>
  <v-app
    id="app"
    class="app-container, theme--light"
  >
    <component is="public-layout">
      <router-view :key="$route.fullPath" />
    </component>
  </v-app>
</template>

<script lang="ts">
import { createComponent, computed, onErrorCaptured, onMounted } from '@vue/composition-api'
import { useUsers } from '@/users/users'

const DefaultLayout = 'public'

function origin(): string {
  const root = window.location.origin || ''
  const path = process.env.BASE_URL
  return `${root}${path}`
}

export default createComponent({
  components: {
  },
  setup(_, { root }) {
    // const layout = computed((): string => (root.$router.currentRoute.meta.layout || DefaultLayout) + '-layout')
    const { setUser } = useUsers()

    onErrorCaptured((err): void => {

    })

    onMounted(() => {
      const stashedUser = sessionStorage.getItem('user')
      console.log('stashed user', stashedUser)
      if (stashedUser) {
        setUser(parseInt(stashedUser))
      }
    });

    return {  }
  }
})

</script>
