import {QIcon} from 'quasar'
import money from '../../components/money'
import tooltip from '../../components/tooltip'

export default function ({ fieldInitData, additionalFieldProps }) {
  return {
    name: 'money',
    component: money,
    readonlyComponent: money,
    on: {
      change: (event) => {
        fieldInitData.onChange(event, { type: 'number' })
      },
      input: (...args) => {
        fieldInitData.onInput(...args, additionalFieldProps.currencyField.name)
      },
    },
    props: {
      ...fieldInitData.props,
      options: [
        ...additionalFieldProps.currencyField.enum.$$list.map(option => ({
          label: this.$t(this.$t(option.$$key)),
          value: option.name,
        })),
      ],
      currencyFieldValue: fieldInitData.model[additionalFieldProps.currencyField.name],
      readonly: fieldInitData.props.readonly,
    },
    directives: [
      {
        name: 'l',
        value: {
          [`${fieldInitData.field.$$key}.label`]: this.$t(`${fieldInitData.field.$$key}.label`),
          [`${fieldInitData.field.$$key}.hint`]: this.$t(`${fieldInitData.field.$$key}.hint`),
          [`${fieldInitData.field.$$key}.tooltip`]: this.$t(`${fieldInitData.field.$$key}.tooltip`),
          ...additionalFieldProps.currencyField.enum.$$list.reduce((acc, option) => ({ ...acc, [option.$$key]: this.$t(option.$$key) }), {}),
        },
      }
    ],
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
