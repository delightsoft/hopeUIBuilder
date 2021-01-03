export default ({ props: { row }, rowKey, _this, field }) => ({
  component: 'div',
  children: _this.$t(_this.$t(field.enum.$$list.find(option => option.name === row[rowKey])?.$$key)) || ' — ',
})
