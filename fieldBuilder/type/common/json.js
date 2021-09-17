import { QIcon, QInput } from 'quasar'
import tooltip from '../../components/tooltip'

export default function ({ fieldInitData, additionalFieldProps }) {
  const rawValue = fieldInitData.props.value
  const value = typeof rawValue === 'object' ? JSON.stringify(rawValue, null, 2) : rawValue
  let isNotJSON = false

  return {
    name: 'json',
    component: QInput,
    data: () => {
      return {
        value: ''
      }
    },
    on: {
      change: (event) => {
        const value = event.srcElement.value
        try {
          JSON.parse(value);
        } catch (e) {
          return
        }

        fieldInitData.onChange(value, {
          clearValue: (value) => {
            return JSON.parse(value)
          }
        })
      },
      input: fieldInitData.inputDebounce(value => {
        let parsedValue
        try {
          parsedValue = JSON.parse(value);
        } catch (e) {
          isNotJSON = true
        }
        const newValue = parsedValue ? JSON.stringify(parsedValue, null, 2) : value
        fieldInitData.onInput(newValue, null, null, true, true)
      }),
    },
    props: {
      filled: false,
      outlined: true,
      disabled: true,
      readonly: false,
      type: 'textarea',
      'bottom-slots': true,
      value: value
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
