<template>
  <q-tooltip
    v-if="mode === 'standard'"
  >
    {{ text }}
  </q-tooltip>
  <q-popup-proxy
    v-else
  >
    <q-banner
      class="tooltip-popup"
    >
      <q-markdown>{{ text }}</q-markdown>
    </q-banner>
  </q-popup-proxy>
</template>

<script>
export default {
  data() {
    return {
      mode: null,
      text: '',
    }
  },
  created() {
    if (this.$slots?.default?.[0]) {
      if (/^\$\$/g.test(this.$slots.default[0].text)) {
        this.mode = 'markdown';
        this.text = this.$slots.default[0].text.replace(/^\$\$/g, '');
      } else {
        this.mode = 'standard';
        this.text = this.$slots.default[0].text;
      }
    }
  },
}
</script>

<style lang="sass">
  .tooltip-popup
    padding: 6px 10px
    min-height: auto
    max-width: 320px
    & .q-markdown
      & p:last-child
        margin: 0
    & .q-markdown--link
      color: $primary
    & .text-body2
      font-size: 15px
      color: #000
</style>
