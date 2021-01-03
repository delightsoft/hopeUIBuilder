import moment from 'moment'
export default ({ props: { row }, rowKey, _this, field }) => ({
  component: 'div',
  style: {
    whiteSpace: 'nowrap',
  },
  children:
  (moment(row[rowKey]) && row[rowKey])?
    _this.$app.lang === 'ru' ?
      moment(row[rowKey]).format('DD.MM.YYYY'):
      moment(row[rowKey]).format('DD/MM/YYYY')
    : ' — ',
})
