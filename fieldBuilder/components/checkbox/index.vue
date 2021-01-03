<template>
  <div
    class="checkbox"
    :class="{
      'checkbox_error': error
    }"
  >
    <q-checkbox
      v-if="!readonly"
      v-model="formValue"
      v-bind="$attrs"
      error
      :tabindex="tabindex"
    >
      <slot name="default" />
    </q-checkbox>
    <div
      v-else
    >
      <readonly
        :label="$attrs.label"
        :value="formValue ? $t('yes') : $t('no')"
      >
        <template v-slot:default>
          <slot name="default" />
        </template>
      </readonly>
    </div>
    <div
      v-if="hint"
      class="checkbox__hint"
    >
      {{ hint }}
    </div>
<!--    <div-->
<!--      v-if="hint || error"-->
<!--      class="checkbox__hint"-->
<!--    >-->
<!--      {{ errorMessage || hint }}-->
<!--    </div>-->
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
  components: {
    readonly,
  },
}
</script>

<style lang="sass">
.checkbox
  padding-top: 10px
  &_error
    color: $negative
    & .q-checkbox__inner
      color: $negative
  & .q-checkbox
    align-items: start
    &__label
      align-self: center
  &__hint
    font-size: 11px
    color: rgba(0, 0, 0, 0.54)
    padding: 0 13px
    line-height: 1

</style>
