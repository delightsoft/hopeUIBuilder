export default ({ props: { row }, rowKey, _this, field }) => ({
  component: 'div',
  children: _this.$t(_this.$t(row[rowKey])) || ' — ',
})
