<template lang="pug">
  div(class="features")
    v-checkbox(id="featureOne", class="f-check", v-model="featureOneFlag", :label="fOneToggleLabel")
</template>

<script>
    import AppData from '@/utils/app-data'
    export default {
        data: function () {
            return {
                appData: AppData,
                featureOneFlag: AppData.features.featureOne
            }
        },
        computed: {
            fOneToggleLabel() {
                return this.featureOneFlag ? 'Disable F One' : ' Enable F One'
            },
            featureOne () {
                return this.appData.features.featureOne
            }
        },

        watch: {
            featureOneFlag: function (flag) {
                this.appData.features.featureOne = flag
            }
        },

    }
</script>
<style lang="scss">
@import '@/assets/styles/theme.scss';

  .features {
    margin-left: 2rem;
    label {
      color: $gray3 !important;
      font-size: 16px;
    }
    i {
      color: $gray3 !important;
      /*font-size: 16px !important;*/
    }
  }
  .f-check {
    height: 5px;
  }
</style>
