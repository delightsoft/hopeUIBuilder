import {QIcon} from 'quasar'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'
import dateTimeInput from '../../components/dateTimeInput'
import moment from 'moment'

export default function ({ fieldInitData, additionalFieldProps }) {
  let params;
  let splittedParams;
  let minYear = undefined;
  let maxYear = undefined;
  if (fieldInitData.field.validate) {
    let validateString = fieldInitData.field.validate;
    const iStart = validateString.indexOf('(');
    const iEnd = validateString.indexOf(')');
    if (iStart !== -1 && iEnd !== -1) {
      params = validateString.slice(iStart + 1, iEnd)
      splittedParams = params.split(',').map(i => i.trim())

      minYear = splittedParams[0]
      if (minYear) {
        if (minYear === 'now') minYear = moment.utc()
        else minYear = moment.utc(minYear)
        if (minYear === 'Invalid date') minYear = undefined;
      }
      
      maxYear = splittedParams[1]
      if (maxYear) {
        if (maxYear === 'now') maxYear = moment.utc()
        else maxYear = moment.utc(maxYear)
        if (maxYear === 'Invalid date') maxYear = undefined;
      }
    }
  }
  
  return {
    name: 'dateonly',
    component: dateTimeInput,
    readonlyComponent: readonly,
    on: {
      change: fieldInitData.onChange,
    },
    props: {
      fieldKey: fieldInitData.fieldNameWithParentFieldNameWithIndex,
      mode: 'date',
      options: additionalFieldProps.datePickerOptions,
      readOnlyFormatting (value) {
        if (value && moment(value)){
          if (this.$app.lang === 'ru') return moment(value).format('DD.MM.YYYY');
          else return moment(value).format('DD/MM/YYYY');
        } else {
          return value;
        }
      },
      tabindex: fieldInitData.tabindex,
      navigationMinYearMonth: (() => {
        if (fieldInitData.fieldName === 'endDate') {
          const endDateKey = fieldInitData.fieldNameWithParentFieldNameWithIndex
          const startDateKey = `${endDateKey.split('.').slice(0, -1).join('.')}.startDate`

          const path = startDateKey.split('.')
          let startDate = path.reduce((acc, cv) => {
            let isplitted = cv.split(/(?=\[)/g)
            if (isplitted.length > 1) {
              acc = acc[isplitted[0]]
              acc = acc[isplitted[1].slice(1, -1)]
            } else {
              acc = acc[cv]
            }
            return acc
          }, this.value)
          if (startDate) return startDate
        } else if (minYear) return minYear
      })(),
      navigationMaxYearMonth: maxYear ? maxYear : undefined
    },
    scopedSlots: {
      after: () => {
        if (this.$t(this.$t(`${fieldInitData.field.$$key}.tooltip`))) {
          return this.h(
            QIcon,
            {
              class: ['tooltip', 'cursor-help'],
              props: {
                name: 'help',
                size: '20px',
              },
            },
            [
              this.h(
                tooltip,
                this.$t(this.$t(`${fieldInitData.field.$$key}.tooltip`))
              )
            ]
          )
        }
      },
    }
  }
}
