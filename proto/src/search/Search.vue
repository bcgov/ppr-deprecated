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
      disabled=true,
      label="Debtor name",
      :hint="debtorValidDescription",
      :rules="debtorValidationRules",
      @search="debtorSearch"
      )
    section
      search-input(
      id="serial",
      disabled=true,
      label="Serial number",
      :hint="serialValidDescription",
      :rules="serialValidationRules",
      @search="serialSearch"
      )
    section
      search-input(
      id="general",
      disabled=true,
      label="General collateral",
      :hint="generalValidDescription",
      :rules="generalValidationRules",
      @search="generalSearch"
      )
</template>

<script lang="ts">
  import {computed, createComponent} from '@vue/composition-api'
  import { useSearching, SearchTypes } from '@/search/searching'
  import SearchInput from '@/search/SearchInput.vue'

  export default createComponent({
    components: {SearchInput},

    setup(_, {root}) {
      const {regNumSearch, regNumValidationRules, regNumValidDescription} = useRegNum(root)
      const {generalSearch, generalValidDescription, generalValidationRules} = useGeneral(root)
      const {debtorSearch, debtorValidationRules, debtorValidDescription} = useDebtor(root)
      const {serialSearch, serialValidDescription, serialValidationRules} = useSerial(root)
      return {
        debtorSearch, debtorValidationRules, debtorValidDescription,
        generalSearch, generalValidDescription, generalValidationRules,
        regNumSearch, regNumValidationRules, regNumValidDescription,
        serialSearch, serialValidDescription, serialValidationRules
      }
    }
  })

  function useDebtor(root) {
    const REG_EXP = /^[a-zA-Z]{1,38}$/
    const REG_NUM_MAX = 38
    const TEXT = {
      describeValid: `A valid registration number has up to ${REG_NUM_MAX} letters`,
      label: 'Registration number',
      required: 'A debtor name is required',
      tooLong: `Entered debtor number its too long. Maximum length is ${REG_NUM_MAX} characters`
    }

    const debtorValidationRules = computed(() => {
      return [
        (value): (boolean | string) => {
          return !!value || TEXT.required
        },
        (value): (boolean | string) => {
          return value.length <= REG_NUM_MAX || TEXT.tooLong
        },
        (value): (boolean | string) => {
          return REG_EXP.test(value) || TEXT.describeValid
        }
      ]
    })

    const debtorValidDescription = computed(() => TEXT.describeValid)

    function debtorSearch(term) {
      const { searchDo } = useSearching()
      const searchId = searchDo(SearchTypes.DEBTOR, term)
      root.$router.push({ name: 'results', query: { searchId: searchId } })
    }

    return {debtorSearch, debtorValidDescription, debtorValidationRules}
  }

  function useGeneral(root) {
    const REG_NUM_MAX = 250
    const TEXT = {
      label: 'General collateral',
      describeValid: `A valid collateral search can contain what you need`,
      required: 'A term to search the general collateral is required',
      tooLong: `Entered term for searching general collateral is too long. Maximum length is ${REG_NUM_MAX} characters`
    }

    const generalValidationRules = computed(() => {
      return [
        (value): (boolean | string) => {
          return !!value || TEXT.required
        },
        (value): (boolean | string) => {
          return value.length <= REG_NUM_MAX || TEXT.tooLong
        }
      ]
    })

    const generalValidDescription = computed(() => TEXT.describeValid)

    function generalSearch(term) {
      const { searchDo } = useSearching()
      const searchId = searchDo(SearchTypes.GENERAL, term)
      root.$router.push({ name: 'results', query: { searchId: searchId } })
    }

    return {generalSearch, generalValidDescription, generalValidationRules}
  }

  function useRegNum(root) {
    const REG_EXP = /^[0-9a-zA-Z]{1,8}$/
    const REG_NUM_MAX = 8
    const TEXT = {
      errorMsg: (text: string): string => `Error with registration number search - ${text}`,
      describeValid: `A valid registration number has up to ${REG_NUM_MAX} letters and numbers`,
      label: 'Registration number',
      required: 'The registration number is required',
      tooLong: `Entered registration number its too long. Maximum length is ${REG_NUM_MAX} characters`
    }

    const regNumValidationRules = computed(() => {
      return [
        (value): (boolean | string) => {
          return !!value || TEXT.required
        },
        (value): (boolean | string) => {
          return value.length <= REG_NUM_MAX || TEXT.tooLong
        },
        (value): (boolean | string) => {
          return REG_EXP.test(value) || TEXT.describeValid
        }
      ]
    })

    const regNumValidDescription = computed(() => TEXT.describeValid)

    function regNumSearch(term) {
      const { searchDo } = useSearching()
      const searchId = searchDo(SearchTypes.REG_NUM, term)
      root.$router.push({ name: 'results', query: { searchId: searchId } })
    }

    return {regNumSearch, regNumValidDescription, regNumValidationRules}
  }

  function useSerial(root) {
    const REG_EXP = /^[0-9a-zA-Z]{1,25}$/
    const REG_NUM_MAX = 25
    const TEXT = {
      errorMsg: (text: string): string => `Error with serial number search - ${text}`,
      describeValid: `A valid serial number has up to ${REG_NUM_MAX} letters and numbers`,
      label: 'Serial number',
      required: 'The serial number is required',
      tooLong: `Entered serial number its too long. Maximum length is ${REG_NUM_MAX} characters`
    }

    const serialValidationRules = computed(() => {
      return [
        (value): (boolean | string) => {
          return !!value || TEXT.required
        },
        (value): (boolean | string) => {
          return value.length <= REG_NUM_MAX || TEXT.tooLong
        },
        (value): (boolean | string) => {
          return REG_EXP.test(value) || TEXT.describeValid
        }
      ]
    })

    const serialValidDescription = computed(() => TEXT.describeValid)

    function serialSearch(term) {
      const { searchDo } = useSearching()
      const searchId = searchDo(SearchTypes.SERIAL, term)
      root.$router.push({ name: 'results', query: { searchId: searchId } })
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
