import moment from "moment/moment";

export default ({ props: { row }, rowKey, _this, field }) => ({
  component: 'div',
  style: {
    'white-space': 'nowrap',
  },
  children:
    (moment(row[rowKey]) && row[rowKey])?
      _this.$app.lang === 'ru' ?
        moment(row[rowKey]).format('DD.MM.YYYY HH:mm'):
        moment(row[rowKey]).format('DD/MM/YYYY HH:mm')
      : ' — ',
})
