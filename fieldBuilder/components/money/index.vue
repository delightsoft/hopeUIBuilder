<template>
  <div class="money">
    <div
      v-if="!readonly"
      class="money__input"
    >
      <q-input
        :value="model"
        :label="label"
        @input="input"
        @blur="blur"
        type="number"
        filled
        :error="error"
        :error-message="errorMessage"
        @keydown.enter="emulateKeyboardTabDown"
      >
        <template v-slot:append>
          <q-select
            :value="currencyFieldValue"
            :options="options"
            @input="currencyFieldInput"
            class="money__currency"
            borderless
            option-value="value"
            option-label="label"
            emit-value
            map-options
          />
        </template>
      </q-input>
    </div>
    <div
      v-else
    >
      <readonly
        :value="price"
        :label="label"
      >
        <template v-slot:default>
          <slot name="default" />
        </template>
      </readonly>
    </div>
  </div>
</template>

<script>
import readonly from '../readonly/'
import emulateKeyboardTabDown from '../../../utils/emulateKeyboardTabDown'

export default {
  props: [
    'value',
    'currencyFieldValue',
    'options',
    'hint',
    'label',
    'readonly',
    'error',
    'errorMessage',
  ],
  data() {
    return {
      model: null,
      currencyModel: null,
    }
  },
  created() {
    this.model = this.value;
  },
  computed: {
    price() {
      const value = this.value;
      const currencyFieldValue = this.currencyFieldValue;
      return value ? this.$n(value, 'currency', currencyFieldValue.toUpperCase()) : ' — ';
    }
  },
  methods: {
    emulateKeyboardTabDown: emulateKeyboardTabDown,
    input(value) {
      this.model = Number(value);
    },
    blur() {
      this.$emit('change', this.model);
    },
    currencyFieldInput(value) {
      this.$emit('input', value);
    },
  },
  components: {
    readonly,
  },
}
</script>

<style lang="sass">
  .money
    &__currency
      & .q-field__control
        padding: 0
      & .q-field__control:before
        border: none
      & .q-field__control:after
        border: none
</style>
