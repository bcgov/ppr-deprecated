<template lang="pug">
  div(class="features")
    v-checkbox(class="f-check", v-model="featureTwoFlag", :label="fOneToggleLabel")
</template>

<script>
    import AppData from '@/utils/app-data'
    export default {
        data: function () {
            return {
                appData: AppData,
                featureTwoFlag: AppData.features.featureTwo
            }
        },
        computed: {
            fOneToggleLabel() {
                return this.featureTwoFlag ? 'Disable F Two' : ' Enable F Two'
            },
            featureTwo () {
                return this.appData.features.featureTwo
            }
        },

        watch: {
            featureTwoFlag: function (flag) {
                this.appData.features.featureTwo = flag
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
