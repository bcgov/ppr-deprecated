<template lang="pug">
  div
    h2 Financing Statements
    div
      v-btn(@click="saveFinancingStatements") Save
    div
      label(for="loadFS") Import financing statements as JSON:
      input(type="file", id="loadFS", name="loadFS", accept="application/json", @change="setFile")
    div(style="display:none")
      label(for="avatar") Choose a profile picture:
      input(type="file", id="avatar", name="avatar", accept="image/png, image/jpeg")


</template>

<script>
  import { createComponent } from '@vue/composition-api'
  import { useAdmin } from '@/admin/admin'

  export default createComponent({
    setup(_, { root }) {
      const { loadFinancingStatements, saveFinancingStatements } = useAdmin()

      function setFile (event) {
        const file = event.target.files[0]
        console.log("File name", file)
        loadFinancingStatements(file)
      }

      return {
        saveFinancingStatements,
        setFile
      }
    }
  })


</script>

<style scoped>

</style>
