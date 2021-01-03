export default ({ h, props: { row }, rowKey, _this, field, isConsistently }) => ({
  component: 'span',
  children: _this.$t(_this.$t(row[rowKey])) || (isConsistently === undefined || isConsistently ? ' — ' : null),
})
