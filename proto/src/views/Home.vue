<template>
  <div>
    <v-container class="view-container">
      <article id="dashboardArticle">
        <header>
          <h1>Welcome {{ currentUser ? currentUser.name : '' }} to the prototype Personal Property Registry</h1>
        </header>

        <div class="page-content">
          <div class="page-content__main">
            <p>
              <em>Note: This web site is a PROTOTYPE.</em>
            </p>
            <p>
              Protect yourself from loss or legal conflict by registering your interest in personal property (cars,
              boats, trailers or machinery) or searching for existing liens on personal property prior to purchase.
            </p>
            <p>
              The Personal Property Registry records all of the encumbrances (such as liens) created against personal
              property in B.C., whether it belongs to a business or an individual. The Registry provides personal
              property registration and search services for lenders, sellers, garage keepers, taxing authorities,
              government agencies, purchasers and general public.
            </p>
            <p>
              For more information please visit
              <a href="https://www2.gov.bc.ca/gov/content?id=568423FB83BD44A28B80B48EE85A0810">
                Personal Property Registry
              </a>
            </p>

          </div>
          <div v-if="authenticated">
            Current persona is:
            <div class="user-section">
              <div> Name: {{ currentUser.name }} {{ currentUser.last }}, </div>
              <div> Company: {{ currentUser.company }}, </div>
              <div> Occupation: {{ currentUser.occupation }} </div>
              <div> Role: {{ currentUser.role }} </div>
              <div> Party:
                <party-code :value="currentUser.party" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </v-container>
  </div>
</template>

<script lang="ts">
  import {createComponent, ref} from '@vue/composition-api'
  import { useUsers } from '@/users/users'
  import PartyCode from '@/party-code/PartyCode.vue'

  export default createComponent({
    components: { PartyCode },
    setup(_, {root}) {
      const { authenticated, currentUser} = useUsers()
      return {authenticated, currentUser}
    }
  })

</script>

<style lang="scss" scoped>

  .user-section{
    padding-left:1rem;
  }
</style>
