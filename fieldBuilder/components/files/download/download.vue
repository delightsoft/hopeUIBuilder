<template>
  <list-files
    :fieldInitData="fieldInitData"
    :additionalFieldProps="additionalFieldProps"
    :uiModel="uiModel"
  />
</template>

<script>
import i18n from './i18n'
import ListFiles from './listFiles'

const TIMEOUT = 3000;

export default {
  name: "download",
  i18n,
  props: {
    fieldInitData: Object,
    additionalFieldProps: Object,
    uiModel: Object,
  },
  components: {ListFiles},

}
</script>

<style lang="sass">

</style>
