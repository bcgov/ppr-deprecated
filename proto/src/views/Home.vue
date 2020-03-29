<template>
  <div>
    <v-container class="view-container">
      <article id="dashboardArticle">
        <header>
          <h1>Welcome to the Personal Property Registry</h1>
        </header>

        <div class="page-content">
          <div class="page-content__main">
            <p>
              <em>Note: This web site is a work in progress.</em>
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
          <div v-if="userIsAuthed">
            Current User: {{ currentUser.name }} {{ currentUser.last }}, {{ currentUser.company }}, {{ currentUser.occupation }}
          </div>
          <div>
            <ul>
              <li v-if="userIsAuthed">
                <router-link to="search">
                  Search
                </router-link>
              </li>
              <li v-if="userIsAuthed">
                <router-link to="financing">
                  Financing Statement
                </router-link>
              </li>
              <li>
                <router-link to="about">
                  About
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </v-container>
  </div>
</template>

<script lang="ts">
  import {createComponent, ref} from '@vue/composition-api'
  import {mockStorage} from '@/proto/mock-storage'

  export default createComponent({
    setup(_, {root}) {
      const userIsAuthed = ref(mockStorage.isAuthed())
      const currentUser = ref(mockStorage.getCurrentUser())

      return {currentUser, userIsAuthed}
    }
  })

</script>
