<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-select
        v-if="!readonly"
        filled
        v-model="formValue"
        :options="options"
        label="Single"
        style="width: 250px"
      />
      <div
        v-else
      >
        <readonly
          :label="$attrs.label"
          :value="formValue ? $t('yes') : $t('no')"
        >
          <template v-slot:default>
            <slot name="default"/>
          </template>
        </readonly>
      </div>
      <div
        v-if="hint"
        class="select__hint"
      >
        {{ hint }}
      </div>
    </div>
  </div>
</template>

<script>
import readonly from '../readonly'

export default {
  props: [
    'value',
    'readonly',
    'hint',
    'error',
    'errorMessage',
    'tabindex',
    'opts'
  ],
  created() {
    console.log(999, this)
  },
  computed: {
    formValue: {
      set: function (value) {
        this.$emit('input', value);
      },
      get: function () {
        return this.value;
      }
    },
    options: {
      set: function (opts) {
        Object.assign(this.opts, opts);
      },
      get: function () {
        return this.opts;
      }
    },
  },
  components: {
    readonly,
  },
}
</script>

<style lang="sass">
.select
  padding-top: 10px

  &_error
    color: $negative

    & .q-select__inner
      color: $negative

  & .q-select
    align-items: start

    &__label
      align-self: center

  &__hint
    font-size: 11px
    color: rgba(0, 0, 0, 0.54)
    padding: 0 13px
    line-height: 1

</style>
