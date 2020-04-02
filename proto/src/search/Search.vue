<template lang="pug">
  div
    section
      search-input(
      id="regNum",
      label="Registration number",
      :hint="regNumValidDescription",
      :rules="regNumValidationRules",
      @search="regNumSearch"
      )
    section
      search-input(
      id="debtor",
      label="Debtor name",
      :hint="debtorValidDescription",
      :rules="debtorValidationRules",
      @search="debtorSearch"
      )
    section
      search-input(
      id="serial",
      label="Serial number",
      :hint="serialValidDescription",
      :rules="serialValidationRules",
      @search="serialSearch"
      )
    section
      search-input(
      id="general",
      label="General collateral",
      :hint="generalValidDescription",
      :rules="generalValidationRules",
      @search="generalSearch"
      )
</template>

<script lang="ts">
  import {computed, createComponent} from '@vue/composition-api'
  import { useSearching } from '@/search/searching'
  import SearchInput from '@/search/SearchInput.vue'

  export default createComponent({
    components: {SearchInput},

    setup(_, {root}) {
      const {regNumSearch, regNumValidationRules, regNumValidDescription} = useRegNum()
      const {generalSearch, generalValidDescription, generalValidationRules} = useGeneral()
      const {debtorSearch, debtorValidationRules, debtorValidDescription} = useDebtor()
      const {serialSearch, serialValidDescription, serialValidationRules} = useSerial()
      return {
        debtorSearch, debtorValidationRules, debtorValidDescription,
        generalSearch, generalValidDescription, generalValidationRules,
        regNumSearch, regNumValidationRules, regNumValidDescription,
        serialSearch, serialValidDescription, serialValidationRules
      }
    }
  })

  function useDebtor() {
    const REG_EXP = /^[a-zA-Z]{1,38}$/
    const REG_NUM_MAX = 38
    const REG_NUM = {
      describeValid: `A valid registration number has up to ${REG_NUM_MAX} letters`,
      label: 'Registration number',
      required: 'A debtor name is required',
      tooLong: `Entered debtor number its too long. Maximum length is ${REG_NUM_MAX} characters`
    }

    const debtorValidationRules = computed(() => {
      return [
        (value): (boolean | string) => {
          return !!value || REG_NUM.required
        },
        (value): (boolean | string) => {
          return value.length <= REG_NUM_MAX || REG_NUM.tooLong
        },
        (value): (boolean | string) => {
          return REG_EXP.test(value) || REG_NUM.describeValid
        }
      ]
    })

    const debtorValidDescription = computed(() => REG_NUM.describeValid)

    function debtorSearch(term) {
      const { SearchTypes } = useSearching()
      console.log("Search by debtor for ", term, SearchTypes.DEBTOR)
      //       root.$router.push({ name: 'results', query: { searchId: searchId } })
    }

    return {debtorSearch, debtorValidDescription, debtorValidationRules}
  }

  function useGeneral() {
    const REG_NUM_MAX = 250
    const REG_NUM = {
      label: 'General collateral',
      describeValid: `A valid collateral search can contain what you need`,
      required: 'A term to search the general collateral is required',
      tooLong: `Entered term for searching general collateral is too long. Maximum length is ${REG_NUM_MAX} characters`
    }

    const generalValidationRules = computed(() => {
      return [
        (value): (boolean | string) => {
          return !!value || REG_NUM.required
        },
        (value): (boolean | string) => {
          return value.length <= REG_NUM_MAX || REG_NUM.tooLong
        }
      ]
    })

    const generalValidDescription = computed(() => REG_NUM.describeValid)

    function generalSearch(term) {
      const { SearchTypes } = useSearching()
      console.log("Search by general collateral for ", term, SearchTypes.GENERAL)
      //       root.$router.push({ name: 'results', query: { searchId: searchId } })
    }

    return {generalSearch, generalValidDescription, generalValidationRules}
  }

  function useRegNum() {
    const REG_EXP = /^[0-9a-zA-Z]{1,8}$/
    const REG_NUM_MAX = 8
    const REG_NUM = {
      errorMsg: (text: string): string => `Error with registration number search - ${text}`,
      describeValid: `A valid registration number has up to ${REG_NUM_MAX} letters and numbers`,
      label: 'Registration number',
      required: 'The registration number is required',
      tooLong: `Entered registration number its too long. Maximum length is ${REG_NUM_MAX} characters`
    }

    const regNumValidationRules = computed(() => {
      return [
        (value): (boolean | string) => {
          return !!value || REG_NUM.required
        },
        (value): (boolean | string) => {
          return value.length <= REG_NUM_MAX || REG_NUM.tooLong
        },
        (value): (boolean | string) => {
          return REG_EXP.test(value) || REG_NUM.describeValid
        }
      ]
    })

    const regNumValidDescription = computed(() => REG_NUM.describeValid)

    function regNumSearch(term) {
      const { SearchTypes } = useSearching()
      console.log("Search by reg num for ", term, SearchTypes.REG_NUM)
      //       root.$router.push({ name: 'results', query: { searchId: searchId } })
    }

    return {regNumSearch, regNumValidDescription, regNumValidationRules}
  }

  function useSerial() {
    const REG_EXP = /^[0-9a-zA-Z]{1,25}$/
    const REG_NUM_MAX = 25
    const REG_NUM = {
      errorMsg: (text: string): string => `Error with serial number search - ${text}`,
      describeValid: `A valid serial number has up to ${REG_NUM_MAX} letters and numbers`,
      label: 'Serial number',
      required: 'The serial number is required',
      tooLong: `Entered serial number its too long. Maximum length is ${REG_NUM_MAX} characters`
    }

    const serialValidationRules = computed(() => {
      return [
        (value): (boolean | string) => {
          return !!value || REG_NUM.required
        },
        (value): (boolean | string) => {
          return value.length <= REG_NUM_MAX || REG_NUM.tooLong
        },
        (value): (boolean | string) => {
          return REG_EXP.test(value) || REG_NUM.describeValid
        }
      ]
    })

    const serialValidDescription = computed(() => REG_NUM.describeValid)

    function serialSearch(term) {
      const { SearchTypes } = useSearching()
      console.log("Search by serial num for ", term, SearchTypes.SERIAL)
      //       root.$router.push({ name: 'results', query: { searchId: searchId } })
    }

    return {serialSearch, serialValidDescription, serialValidationRules}
  }
</script>


<style lang="scss" scoped>
  @import '../assets/styles/theme.scss';

  section {
    margin: 1rem 0;
  }
</style>
