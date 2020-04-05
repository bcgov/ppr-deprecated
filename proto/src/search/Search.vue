<template lang="pug">
  div
    section
      search-input(
      id="regNum",
      label="Registration number",
      :hint="regNumValidDescription",
      :rules="regNumValidationRules",
      @search="doSearch('regNum',$event)"
      )
    section
      search-input(
      id="debtor",
      disabled=true,
      label="Debtor name",
      :hint="debtorValidDescription",
      :rules="debtorValidationRules",
      @search="doSearch('debtor',$event)"
      )
    section
      search-input(
      id="serial",
      label="Serial number",
      :hint="serialValidDescription",
      :rules="serialValidationRules",
      @search="doSearch('serial',$event)"
      )
</template>

<script lang="ts">
  import {computed, createComponent} from '@vue/composition-api'
  import { useSearching, SearchTypes } from '@/search/searching'
  import SearchInput from '@/search/SearchInput.vue'

  export default createComponent({
    components: {SearchInput},

    setup(_, { root }) {
      const {regNumValidationRules, regNumValidDescription} = useRegNum(root)
      const {generalValidDescription, generalValidationRules} = useGeneral(root)
      const {debtorValidationRules, debtorValidDescription} = useDebtor(root)
      const {serialValidDescription, serialValidationRules} = useSerial(root)

      function doSearch(key: string, term: string) {
        let type: SearchTypes
        if (key === 'debtor')
          type = SearchTypes.DEBTOR
        if (key === 'regNum')
          type = SearchTypes.REG_NUM
        if (key === 'serial')
          type = SearchTypes.SERIAL

        const { searchDo } = useSearching()
        const searchId = searchDo(type, term)
        root.$router.push({ name: 'results', query: { searchId: searchId } })
      }

      return {
        doSearch,
        debtorValidationRules, debtorValidDescription,
        generalValidDescription, generalValidationRules,
        regNumValidationRules, regNumValidDescription,
        serialValidDescription, serialValidationRules
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

    return {debtorValidDescription, debtorValidationRules}
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

    return {generalValidDescription, generalValidationRules}
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

    return {regNumValidDescription, regNumValidationRules}
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

    return {serialValidDescription, serialValidationRules}
  }
</script>


<style lang="scss" scoped>
  @import '../assets/styles/theme.scss';

  section {
    margin: 1rem 0;
  }
</style>
