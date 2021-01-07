<template>
  <div class="readonly-wrapper">
    <div class="readonly">
      <!-- <div :title="label" class="readonly__label ellipsis">
        {{ label }}
        <slot name="default" />
      </div> -->
      <div class="readonly__value">
        <div
          class="flex"
          :class="{ filesInline: additionalFieldProps.oneFile }"
        >
          <download
            v-if="uiModel[fieldInitData.fieldName].attachedFiles.length"
            :fieldInitData="fieldInitData"
            :additionalFieldProps="additionalFieldProps"
            :uiModel="uiModel"
          ></download>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "label",
    "value",
    "fieldInitData",
    "additionalFieldProps",
    "uiModel",
    "options",
  ],
  components: {
    download: () => import("../files/download/download"),
  },
};
</script>

<style lang="sass">
</style>
