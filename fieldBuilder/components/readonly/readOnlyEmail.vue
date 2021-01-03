<template>
  <div class="readonly-wrapper">
    <div class="readonly">
      <div
        :title="label"
        class="readonly__label ellipsis"
      >
        {{ label }}
        <slot name="default" />
      </div>
      <div class="readonly__value">
      <a :href="'mailto:'+value">
        {{value}}
      </a>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'label',
    'value',
  ],
}
</script>

<style lang="sass">

</style>
