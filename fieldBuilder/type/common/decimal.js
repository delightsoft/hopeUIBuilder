import {QIcon, QInput} from 'quasar'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'
import inputFilter from '../../../utils/inputFilter'
// TODO: Можно все скопировать с double, но scale и precision взять не из extra
export default function ({ fieldInitData, additionalFieldProps }) {
  return {
    name: 'decimal',
    component: QInput,
    readonlyComponent: readonly,
    on: {
      change: (event) => {
        fieldInitData.onChange(event, { type: 'number' })
      },
      ...inputFilter.call(this, value => new RegExp(`^-?\\d*[.]?\\d{0,${fieldInitData.field.scale}}$`).test(value)),
    },
    props: {
      filled: true,
      value: fieldInitData.model[fieldInitData.fieldName],
    },
    attrs: {
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
