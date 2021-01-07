<template>
  <div
    class="flex"
    :class="{ filesInline: additionalFieldProps.oneFile }"
  >
    <upload
      :fieldInitData="fieldInitData"
      :additionalFieldProps="additionalFieldProps"
      :uiModel="uiModel"
      :icon="icon"
      :options="options"
    ></upload>
    <download
      v-if="uiModel[fieldInitData.fieldName].attachedFiles.length"
      :fieldInitData="fieldInitData"
      :additionalFieldProps="additionalFieldProps"
      :uiModel="uiModel"
    ></download>
  </div>
</template>

<script>
import Upload from "./upload/upload";
import Download from "./download/download";

export default {
  name: "files",
  props: {
    fieldInitData: Object,
    additionalFieldProps: Object,
    uiModel: Object,
    icon: String,
    options: Object,
  },
  components: {
    Upload,
    Download,
  },
};
</script>

<style lang="sass">
.filesInline
  display: flex
  align-items: flex-start
  flex-wrap: wrap

  .upload
    flex: 1 2 200px
    margin-bottom: 14.4px
    margin-right: 14.4px

  .list-files
    align-items: center
    max-width: 100%
    margin-bottom: 14.4px
    display: flex
    flex-wrap: nowrap
    flex-direction: row-reverse

    .q-list
      flex: 1 1 0%
      overflow: hidden

      .q-item__label
        white-space: nowrap
</style>
