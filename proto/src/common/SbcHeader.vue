<template>
  <header class="app-header">
    <div class="container">
      <a @click="goToHome()" class="brand">
        <picture>
          <img class="brand__image"
            src="../assets/images/gov3_bc_logo.png"
            alt="Government of British Columbia Logo"
            title="Government of British Columbia">
        </picture>
        <span class="brand__title">BC Registries <span class="brand__title--wrap">& Online Services</span></span>
      </a>
      <div class="app-header__actions">
        {{ welcomeText }}
      </div>
      <div class="app-header__actions">
        <v-btn color="#fcba19" class="log-in-btn" @click="login()">{{ buttonText }}</v-btn>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
  import { computed, createComponent,ref } from '@vue/composition-api'
  import { useUsers } from '@/users/users'

  export default createComponent({
    setup(_, { root }) {
      const { authenticated, currentUserIndex, currentUser} = useUsers()

      const buttonText = computed( () => (authenticated.value ? 'Log out of' : 'Log into') + ' the PPR prototype')

      const welcomeText = computed( () => (authenticated.value ? 'Welcome ' + currentUser.value.name : 'Log in'))

      function login(): void {
        if (authenticated.value) {
          root.$router.push({ name: 'logout' })
        } else {
          root.$router.push({ name: 'login' })
        }
      }

      return { authenticated, currentUserIndex, currentUser, login, buttonText, welcomeText}
    }
  })
</script>

<style lang="scss" scoped>
@import "../assets/styles/theme";

$app-header-font-color: #ffffff;

.app-header {
  height: 70px;
  color: $app-header-font-color;
  border-bottom: 2px solid $BCgovGold5;
  background-color: #003366;

  .container {
    display: flex;
    align-items: center;
    height: 100%;
    padding-top: 0;
    padding-bottom: 0;
  }
}

.app-header__actions {
  display: flex;
  align-items: center;
  margin-left: auto;

  .v-btn {
    margin-right: 0;
  }
}

.brand {
  display: flex;
  align-items: center;
  padding-right: 1rem;
  text-decoration: none;
  color: inherit;
}

.brand__image {
  display: block;
  margin-right: 1.25rem;
  max-height: 70px;
}

.brand__title {
  letter-spacing: -0.03rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: inherit;
}

@media (max-width: 600px) {
  .brand__image {
    margin-right: 0.75rem;
    margin-left: -0.15rem;
  }

  .brand__title {
    font-size: 1rem;
    line-height: 1.25rem;
  }

  .brand__title--wrap {
    display: block;
  }
}

.v-btn.user-account-btn {
  padding-right: 0.5rem !important;
  padding-left: 0.5rem !important;
  text-align: left;
  color: $app-header-font-color;
  letter-spacing: 0.02rem;
  font-size: 0.8rem;

  .user-avatar {
    margin-right: 0.75rem;
  }

  .user-name {
    line-height: 1.125rem;
    font-size: 0.75rem;
  }

  .account-name {
    margin-bottom: 0.01rem;
    font-size: 0.7rem;
    opacity: 0.75;
  }
}

.v-btn.messages-btn {
  min-width: auto !important;
  padding-right: 0.5rem !important;
  padding-left: 0.4rem !important;
  color: $app-header-font-color;

  .v-icon {
    font-size: 1.75rem;
  }

  .v-badge {
    margin-right: 0.25rem;
  }
}

@media (max-width: 960px) {
  .v-btn.user-account-btn {
    min-width: auto !important;
    font-size: 0.8rem;

    .user-avatar {
      margin-right: 0;
    }

    .user-info {
      display: none;
    }
  }
}

// Account Menu
.account-menu {
  background: #ffffff;
}

.account-menu__info {
  font-size: 0.875rem;
}

.v-list {
  border-radius: 0;

  .v-list-item__title,
  .v-list-item__subtitle {
    line-height: normal !important;
  }
}

.v-list .v-list-item__title.user-name,
.user-name {
  font-size: 0.875rem;
  font-weight: 400;
}

.v-list .v-list-item__subtitle.account-name,
.account-name {
  font-size: 0.75rem;
}

.user-avatar {
  color: $app-header-font-color;
  border-radius: 0.15rem;
  background-color: $BCgovBlue3;
  font-size: 1.1875rem;
  font-weight: 400;
}

.log-in-btn {
  color: $BCgovBlue5;
  background-color: $BCgovGold4;
  font-weight: 700;
}

.v-list--dense .v-subheader {
  padding-right: 1rem;
  padding-left: 1rem;
}

.v-subheader {
  color: $gray9 !important;
  font-size: 0.875rem;
  font-weight: 700;
}
</style>
