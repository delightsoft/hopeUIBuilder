<template lang="pug">
  .localization-helper(v-if="value")
    q-icon.localization-helper__icon(name="language", size="24px", @click="stopPropagation")
      q-popup-proxy
        q-banner.Hb3cmnDJkUOXFlAN434nS
          .localization-helper-content
            .localization-helper-content__row.flex(v-for="key in Object.keys(value)" :key="key")
              .localization-helper-content__label(@click="() => {copyToClipboard(key)}")
                | {{ key }}
              .localization-helper-content__value(v-if="value[key] !== key")
                | {{ t(value[key]) }}
    slot

</template>

<script>
import {QIcon, QPopupProxy, QBanner} from 'quasar'
import Vue from 'vue'
import copyToClipboard from '../utils/copyToClipboard'

export default {
  props: [
    'value',
  ],
  methods: {
    stopPropagation(event) {
      event.stopPropagation();
    },
    t(t) {
      return Vue.prototype.$app.$t(t);
    },
    copyToClipboard: (text) => {
      try {
        copyToClipboard(text);

        Vue.prototype.$app.$q.notify({
          type: 'info',
          message: Vue.prototype.$app.$t('localizationHelper.copy'),
          progress: true,
          timeout: 8000,
        });
      } catch (e) {
        console.error(e);
      }
    },
  },
  components: {
    QIcon,
    QPopupProxy,
    QBanner,
  },
}
</script>

<style lang="sass">
.Hb3cmnDJkUOXFlAN434nS
  & .localization-helper
    cursor: pointer
    position: absolute
    top: -3px
    left: 0

    &__icon
      color: $primary
      z-index: 1000
      background: #eaeaea
      box-shadow: 0 3px 7px rgba(0, 0, 0, 0.05)
      border-radius: 50%
      padding: 6px
      opacity: 0.6

      &:hover
        opacity: 0.4

  & .localization-helper-content
    font-size: 15px

    & .localization-helper-content__row
      margin-bottom: 6px

    &__label
      cursor: pointer

      &:hover
        opacity: .6

    &__value
      color: rgba(0, 0, 0, 0.54)

      &:before
        color: #000
        content: ' — '
        padding-left: 5px
</style>
