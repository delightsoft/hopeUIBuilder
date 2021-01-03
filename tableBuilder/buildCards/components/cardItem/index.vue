<template>
  <div class="card-item">
    <div class="card-item__label">
      <slot name="label"></slot>
    </div>
    <div class="card-item__value">
      <slot name="value"></slot>
    </div>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="stylus">
  .Hb3cmnDJkUOXFlAN434nS
    & .card-item
      padding-bottom: 14px
      &:last-child
        padding-bottom: 0
      &__label
        font-size: 10px
        letter-spacing: 0.93px
        line-height: 14px
        font-weight: 500
        text-transform: uppercase
      &__value
        font-size: 15px
        letter-spacing: 0.48px
        line-height: 24px
        overflow-x: auto
        &_title
          letter-spacing: 0.27px
</style>
