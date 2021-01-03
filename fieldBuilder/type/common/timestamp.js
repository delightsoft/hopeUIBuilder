import {QIcon} from 'quasar'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'
import dateTimeInput from '../../components/dateTimeInput'
import emulateKeyboardTabDown from '../../../utils/emulateKeyboardTabDown'
import moment from 'moment'

export default function ({ fieldInitData, additionalFieldProps }) {
  return {
    name: 'timestamp',
    component: dateTimeInput,
    readonlyComponent: readonly,
    on: {
      change: fieldInitData.onChange,
      'keydown': (e) => {
        if (e.keyCode === 13) {
          emulateKeyboardTabDown();
        }
      },
    },
    props: {
      fieldKey: fieldInitData.fieldNameWithParentFieldNameWithIndex,
      mode: 'timestamp',
      options: additionalFieldProps.datePickerOptions,
      readOnlyFormatting (value) {
        if (value && moment(value)){
          if (this.$app.lang === 'ru') return moment(value).format('DD.MM.YYYY HH:mm');
          else return moment(value).format('DD/MM/YYYY HH:mm');
        } else {
          return value;
        }
      },
      tabindex: fieldInitData.tabindex,
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
