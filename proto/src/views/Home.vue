<template lang="pug">
  div
    v-container(class="view-container")
      article(id="dashboardArticle")
        v-row
          v-col(cols="10")
            header
              h1 Welcome {{ currentUser ? currentUser.name : '' }} to the prototype Personal Property Registry
          v-col(cols="2")
            proto-to-do
              p.
                Buttons like this one will appear throughout the prototype. Click them to see a list if ideas, suggestions
                to consider or, sometimes, to see what is not complete in the prototype.

        div(class="page-content")
          div(class="page-content__main")
            p
              em Note: This web site is a PROTOTYPE. The following text is sample content.
            p.
              Protect yourself from loss or legal conflict by registering your interest in personal property (cars,
              boats, trailers or machinery) or searching for existing liens on personal property prior to purchase.
            p.
              The Personal Property Registry records all of the encumbrances (such as liens) created against personal
              property in B.C., whether it belongs to a business or an individual. The Registry provides personal
              property registration and search services for lenders, sellers, garage keepers, taxing authorities,
              government agencies, purchasers and general public.
            p For more information please visit &nbsp;
              a(href="https://www2.gov.bc.ca/gov/content?id=568423FB83BD44A28B80B48EE85A0810") Personal Property Registry
          div(v-if="authenticated")
            p Current prototype persona is:
            v-simple-table
              tbody
                tr
                  td Name:
                  td {{ currentUser.name }} {{ currentUser.last }}
                tr
                  td Occupation:
                  td {{ currentUser.occupation }}
                tr
                  td Role:
                  td {{ currentUser.role }}
                tr(v-if="currentUser && currentUser.party")
                  td Party:
                  td
                    party-code(:value="currentUser.party")
</template>

<script lang="ts">
import {createComponent, ref} from '@vue/composition-api'
import { useUsers } from '@/users/users'
import PartyCode from '@/party-code/PartyCode.vue'
import ProtoToDo from '@/components/ProtoToDo.vue'

export default createComponent({
  components: { PartyCode, ProtoToDo },
  setup() {
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
