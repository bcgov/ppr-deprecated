<template lang="pug">
    div(class="nav-bar")
      v-toolbar(flat, class="nav-bar")
        v-toolbar-title
          router-link(to="/") PPR Prototype
        v-toolbar-items
          v-btn( text,
            v-for="menuItem in menuItems",
            :data-test="menuItem.name",
            :key="menuItem.name",
            :to="menuItem.url"
          )
            span {{ menuItem.name }}
</template>

<script lang="ts">
import { computed, createComponent } from '@vue/composition-api'
import { useUsers } from '../users/users'

export default createComponent({
  setup() {
    const { authenticated, canDash, canRegister, canAdmin } = useUsers()
    const menuItems = computed( () => {
      const list = []
      if (authenticated.value) {
        if(canDash.value) {
          list.push({
            name: 'Dashboard',
            url: 'dashboard'
          })
        }
        if(canRegister.value) {
          list.push({
            name: 'Register',
            url: 'financing'
          })
        }
        list.push({
          name: 'Search',
          url: 'search'
        })
        if(canAdmin.value) {
          list.push({
            name: 'Admin',
            url: 'admin'
          })
        }
      }
      list.push({
        name:'About',
        url: 'about'
      })
      return list
    })


    return { canDash, authenticated, menuItems}
  }
})
</script>

<style lang="scss" scoped>
  @import '../assets/styles/theme';

  .nav-bar {
    background-color: $BCgovBlue4 !important;
  }

  .v-toolbar__content {
    background-color: $BCgovBlue4 !important;
    margin-top: 0;
    padding-top: 0;
    max-height: 4rem;
  }

  .v-toolbar__title {
    margin-top: -0.2rem;
    margin-right: 2rem;
    font-size: 1.2857rem;
    font-weight: 700;

    a {
      display: block;
      color: #ffffff;
      text-decoration: none;
    }
  }

  @media (min-width: 960px) {
    .v-toolbar__title {
      font-size: 1.125rem;
    }
  }

  .nav-small .v-toolbar__title {
    margin-right: auto;
  }

  .v-btn {
    color: white;
    font-weight: 600;
  }
</style>
