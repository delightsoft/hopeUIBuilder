<template>
  <div class="readonly-wrapper">
    <div class="readonly">
      <div
        v-if="!(Object.prototype.toString.call(value) === '[object Array]')"
        :title="label"
        class="readonly__label ellipsis"
      >
        {{ label }}
        <slot v-if="!readonlyWithoutDefaultSlot" name="default"/>
      </div>
      <div class="readonly__value" v-html="formattedValue"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'label',
    'value',
    'readOnlyFormatting',
    'readonlyWithoutDefaultSlot'
  ],
  computed: {
    formattedValue() {
      let value = this.value;
      if (this.readOnlyFormatting && typeof this.readOnlyFormatting === 'function') {
        value = this.readOnlyFormatting(this.value);
      }

      return value === true ?
        this.$t('yes') :
        value === false ? this.$t('no') :
          Object.prototype.toString.call(value) === '[object Object]' ? (value.label ? value.label : " — ") :
            Object.prototype.toString.call(value) === '[object Array]' ? (value.map(i => i.label).join("; ") ? value.map(i => i.label).join("; ") : " — ") :
              value ? value : ' — '
    }
  }
}
</script>

<style lang="sass">
.readonly
  position: relative
  margin: 0 12px

  &__label
    color: rgba(0, 0, 0, 0.6)
    font-size: 16px
    line-height: 20px
    font-weight: 400
    letter-spacing: .00937em
    transform: translateY(-40%) scale(0.75)
    right: calc(-100% / 3)
    top: 15px
    left: 0
    position: absolute
    text-transform: inherit
    transform-origin: left top

  &__value
    line-height: 24px
    padding-top: 24px
    padding-bottom: 8px
    font-weight: 400
    letter-spacing: .00937em
    color: rgba(0, 0, 0, 0.87)
    outline: 0
    font-size: 14px
    cursor: text
</style>
