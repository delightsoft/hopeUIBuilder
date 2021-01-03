import readonlyEmail from '../../components/email'

export default ({ h, props: { row }, rowKey, _this, field, isConsistently }) => ({
  component: readonlyEmail,
  props: {
    value: row[rowKey],
  },
  children: _this.$t(_this.$t(row[rowKey])) || (isConsistently === undefined || isConsistently ? ' — ' : null),
})
