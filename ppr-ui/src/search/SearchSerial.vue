<template>
  <v-card flat>
    <v-text-field
      id="searchSerialNumber"
      v-model="serialNumber"
      label="Serial number"
      :hint="describeValidSerial"
      :rules="validationRules"
      required
    />
    <v-btn
      id="search-btn"
      color="primary"
      :disabled="!formValid"
      @click="doSearch"
    >
      Search
    </v-btn>
    <v-banner
      v-show="errorMessage"
      id="ssErrorMessage"
      single-line
    >
      {{ errorMessage }}
    </v-banner>
  </v-card>
</template>

<script lang="ts">
import {computed, createComponent, ref} from "@vue/composition-api"
import {Data} from "@vue/composition-api/dist/ts-api/component"
import {useLoadIndicator} from "@/load-indicator"
import {useRouter} from '@/router/router'
import {useSearcherSerial} from '@/search/search-serial'

export default createComponent({
  setup(): Data {
    const loadIndicator = useLoadIndicator()
    const searcherSerial = useSearcherSerial()
    const {router} = useRouter()

    const serialNumber = ref<string>('')
    const errorMessage = ref<string>('')

    const describeValidSerial = computed(() => {
      return searcherSerial.describeValidSerial
    })
    const validationRules = computed(() => {
      return searcherSerial.validationRules
    })
    const formValid = computed(() => {
      return searcherSerial.isValid(serialNumber.value)
    })

    function doSearch(): Promise<void> {
      loadIndicator.start()
      errorMessage.value = ''
      return searcherSerial.doSearch(serialNumber.value)
        .then((): void => {
          router.push('results')
        })
        .catch( (eMessage): void => {
          errorMessage.value = eMessage
        })
        .finally(() => {
          loadIndicator.stop()
        })
    }

    return {
      doSearch,
      describeValidSerial,
      errorMessage,
      formValid,
      serialNumber,
      validationRules
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
