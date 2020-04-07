<template lang="pug">
  div
    section
      p.
        Registration number search performs an exact match lookup on the base registration number property.
      search-input(
        id="regNum",
        label="Registration number",
        :hint="regNumValidDescription",
        :rules="regNumValidationRules",
        @search="doSearch('regNum',$event)"
        )
    section
      p.
        Serial number search looks for exact matches and for any serial number that matches the last six characters (similar matches).
      search-input(
        id="serial",
        label="Serial number",
        :hint="serialValidDescription",
        :rules="serialValidationRules",
        @search="doSearch('serial',$event)"
      )
    section
      p.
        Debtor search is not yet implemented, in this prototype.
      search-input(
        id="debtor",
        disabled=true,
        label="Debtor name",
        :hint="debtorValidDescription",
        :rules="debtorValidationRules",
        @search="doSearch('debtor',$event)"
      )

      payment-dialog(
        title="Pay and Search",
        paymentCode="SEARCH",
        quantity="1",
        :open="openPaymentDialog",
        @proceed="proceed",
        @cancel="cancel"
      )

</template>

<script lang="ts">
  import {computed, createComponent, ref} from '@vue/composition-api'
  import { useSearching, SearchTypes } from '@/search/searching'
  import { useUsers, Roles } from '@/users/users'
  import PaymentDialog from "@/payment/PaymentDialog.vue"
  import SearchInput from '@/search/SearchInput.vue'

  export default createComponent({
    components: {PaymentDialog, SearchInput},

    setup(_, { root }) {
      const {regNumValidationRules, regNumValidDescription} = useRegNum(root)
      const {debtorValidationRules, debtorValidDescription} = useDebtor(root)
      const {serialValidDescription, serialValidationRules} = useSerial(root)

      const openPaymentDialog = ref<boolean>(false)

      interface CriteriaInterface {
        type: SearchTypes;
        term: String;
      }
      class Criteria implements CriteriaInterface {
        public type: SearchTypes
        public term: String
        constructor(type, term) {
          this.type = type
          this.term = term
        }
      }
      let searchCriteria: Criteria

      function doSearch(key: string, term: string) {
        // convert key to search type
        let type: SearchTypes
        if (key === 'debtor')
          type = SearchTypes.DEBTOR
        if (key === 'regNum')
          type = SearchTypes.REG_NUM
        if (key === 'serial')
          type = SearchTypes.SERIAL
        // stash the search criteria for use after payment
        searchCriteria = new Criteria(type, term)
        // trigger the payment dialog to evaluate if payment is required and, if yes, to get user consent to search
        openPaymentDialog.value = true
      }

      function proceed(key: string, term: string) {
        // User does not need to pay or consented to pay.
        openPaymentDialog.value = false
        const { searchDo } = useSearching()
        const searchId = searchDo(searchCriteria.type, searchCriteria.term)
        root.$router.push({ name: 'results', query: { searchId: searchId } })
      }

      function cancel() {
        // User chose to not pay.
        openPaymentDialog.value = false
      }

      return {
        doSearch, openPaymentDialog,
        cancel, proceed,
        debtorValidationRules, debtorValidDescription,
        regNumValidationRules, regNumValidDescription,
        serialValidDescription, serialValidationRules
      }
    }
  })

  function useDebtor(root) {
    const REG_EXP = /^[a-zA-Z]{1,38}$/
    const REG_NUM_MAX = 38
    const TEXT = {
      describeValid: `A valid debtor name search has up to ${REG_NUM_MAX} letters`,
      label: 'Debtor name',
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
