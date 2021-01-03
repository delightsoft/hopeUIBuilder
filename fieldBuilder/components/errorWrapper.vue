<template>
  <div :class="['hope--error-wrapper', {'error': error}]">
    <slot></slot>
    <div v-if="error" class="q-field--error">
      <label class="q-field q-field__bottom error" v-html="errorMessage"></label>
    </div>
    <div v-else>
      <label class="q-field q-field__bottom" v-html="hint"></label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Boolean,
      default: false,
    },
    "error-message": {
      type: String,
      default: "",
    },
    hint: {
      type: String,
      default: ""
    }
  },
};
</script>