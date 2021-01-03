<template>
  <div
    class="toggle"
    :class="{
      'q-field--error': $attrs.error,
      'toggle_always': always,
      'toggle_left': $attrs.hasOwnProperty('false-value') ? $attrs['false-value'] === value : !value,
      'toggle_right': $attrs.hasOwnProperty('true-value') ? $attrs['true-value'] === value : !!value,
      'q-field--with-bottom': $attrs['error-message'],
    }"
  >
    <div
      v-if="!readonly"
      class="toggle-content flex items-center"
    >
      <div
        @click="toggle"
        class="toggle__left-label q-toggle__label cursor-pointer"
      >
        {{ falseLabel }}
      </div>
      <q-toggle
        ref="toggle"
        v-model="formValue"
        :class="{
          'text-negative': $attrs.error
        }"
        :label="trueLabel"
        v-bind="$attrs"
      />
      <div v-if="$attrs['error-message']" class="q-field__bottom row items-start q-field__bottom--animated">
        <div class="q-field__messages col">
          <transition
            v-if="$attrs.error"
            appear
            enter-active-class="animated fadeInDown"
          >
            <div>{{ $attrs['error-message'] }}</div>
          </transition>
        </div>
      </div>
    </div>
    <div
      v-else
    >
      <readonly
        :label="value ? trueLabel : falseLabel"
        :value="$t('yes')"
      />
    </div>
  </div>
</template>

<script>
import readonly from '../readonly'

export default {
  props: [
    'value',
    'always',
    'show-active-label',
    'trueLabel',
    'falseLabel',
    'readonly',
  ],
  computed: {
    formValue: {
      set: function (value) {
        this.$emit('input', value);
      },
      get: function () {
        return this.value;
      }
    },
  },
  methods: {
    toggle() {
      this.$refs.toggle.toggle();
    }
  },
  components: {
    readonly,
  },
}
</script>

<style lang="sass">
  .toggle-content
    position: relative
  .toggle_right
    & .toggle__left-label
      color: rgba(0, 0, 0, 0.6)
  .toggle_left
    & .q-toggle .q-toggle__label
      color: rgba(0, 0, 0, 0.6)
  .toggle_always
    & .q-toggle__track
      opacity: .54
    & .q-toggle__thumb:after
      background: currentColor
</style>
