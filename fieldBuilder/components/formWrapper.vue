<template>
  <form @keydown.enter="_submit">
    <slot />
  </form>
</template>

<script>
export default {
  props: {
    'submit': Function
  },
  methods: {
    // Если попробовать отправить форму без обертки setTimout, при том, что в фокусе выбрано поле и модель этого поля
    // обновляется по событию onChange, то на момент отправки модель поля будет не обновленная
    _submit() {
      setTimeout(
        async () => {
          await this.submit();
        },
        0
      )
    },
  }
}
</script>
