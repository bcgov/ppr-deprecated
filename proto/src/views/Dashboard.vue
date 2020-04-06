<template lang="pug">
  div
    v-container(class="view-container")
      article
        header
          h1 Dashboard
        section
          proto-to-do
            p.
              The dashboard provides users with easy access to common secondary functions.
            h4 Registrations
            p.
              This tab needs a tool bar to let the user filter and sort their list.
            h4 Searches
            p.
              This tab needs a tool bar to let the user filter and sort their list.
            h4 Client Codes
            p.
              The client code system needs more development. Each user account should have it's own set of
              client codes. The codes themselves should be hidden from the user.  Users should only see
              what human readable.  The "code" is placed into Financing Statements in every secured party
              and in the registering party.  When the Financing Statement is display the code is used, at that
              time, to lookup and display the current value
            h4 Drafts
            p.
              This tab shows a mock up. The prototype system can create a drafts system. When a user first enters
              the Register page this draft system is asked for (a) a new blank Financing Statement or (b) the draft
              that is currently being worked on.  Drafts have a hidden id.
            p.
              This drafts tab lists all unsubmitted drafts. A user can press a button to resume editing. While editing
              the system keeps this draft up to date with every change.
            p.
              On this tab users can delete drafts.
            p.
              The list of drafts uses the same layout, for Financing Statements, as seen on the Registrations tab.
            p.
              In a production system the entire user draft data may be stored as a single JSON data string keyed by the
              user's id. On load the API could be queried for the stash.  Periodically, this client can PUT an update
              (say once every five minutes after a change in drafts has been detected).
            h4 Payments
            p.
              This tab needs a tool bar to let the user filter and sort their list. A download or report generation may
              be worth exploring.

        section
          dash-board


</template>
<script lang="ts">
import { createComponent } from '@vue/composition-api'
import DashBoard from '@/dashboard/Dashboard.vue'
import ProtoToDo from '@/components/ProtoToDo.vue'

export default createComponent({
  components: { DashBoard, ProtoToDo  },
  setup() {
    return {}
  }
})

</script>
