<template>
    <div class="nav-bar">
      <v-toolbar flat>
        <v-toolbar-items>
          <v-btn text
            v-for="menuItem in menuItems"
            :data-test="menuItem.name"
            :key="menuItem.name"
            :to="menuItem.url">
            <span>{{ menuItem.name }}</span>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
    </div>
</template>

<script lang="ts">
import { NavigationBarConfig } from '@/proto/NavigationBarConfig'
import { computed, createComponent, reactive, ref } from '@vue/composition-api'
import { useUsers } from '@/proto/users'

export default createComponent({
  setup(_, { root }) {
    const { authenticated } = useUsers()
    const menuItems = computed( () => {
      const list = []
      list.push({
        name:'Home',
        url: 'home'
      })
      if (authenticated.value) {
        list.push({
          name: 'Dashboard',
          url: 'dashboard'
        })
        list.push({
          name: 'Party Codes',
          url: 'party-codes'
        })
        list.push({
          name: 'Register',
          url: 'financing'
        })
        list.push({
          name: 'Search',
          url: 'search'
        })
      }
      list.push({
        name:'About',
        url: 'about'
      })
      return list
    })


    return { authenticated, menuItems}
  }
})
</script>



<style lang="scss" scoped>
  @import '../assets/styles/theme.scss';

  .v-toolbar {
    margin-top: 0;
    padding-top: 0;
    max-height: 4rem;
  }

  .toolbar-container {
    border-top: 1px solid $BCgovBlue4;
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

  ::v-deep .v-toolbar__content {
    max-width: 1360px;
    margin: 0 auto;
  }

  .v-btn {
    font-weight: 400;
  }

  .v-btn.menu-btn {
    font-weight: 700;
  }

  .v-list {
    border-radius: 0 !important;
  }

  .theme--dark.v-btn--active:before,
  .theme--dark.v-btn--active:hover:before {
    //border-bottom: 3px solid $BCgovGold5;
    background-color: $BCgovBlue3;
    opacity: 0.5;
  }

  .theme--dark.v-btn:focus:before {
    background-color: $BCgovBlue3;
    opacity: 0.5;
  }
</style>
