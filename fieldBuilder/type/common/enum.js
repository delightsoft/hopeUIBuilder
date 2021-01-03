import { QIcon, QSelect } from 'quasar'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'

export default function ({ fieldInitData, additionalFieldProps }) {
  return {
    name: 'enum',
    component: QSelect,
    readonlyComponent: readonly,
    on: {
      input: fieldInitData.onInput,
    },
    props: {
      'option-value': 'value',
      'option-label': 'label',
      'emit-value': true,
      'map-options': true,
      filled: true,
      options: [
        ...fieldInitData.field.enum.$$list.reduce((acc, option) => {
          if (!option.extra || !option.extra.hasOwnProperty('selectable') || option.extra.selectable)
            acc.push(
              {
                label: this.$t(this.$t(option.$$key)),
                value: option.name,
              });
          return acc;
        }, []),
      ],
      ...fieldInitData.props.readonly && { value: this.$t(this.$t(fieldInitData.field.enum.$$list.find(option => fieldInitData.model[fieldInitData.fieldName] === option.name)?.$$key)) },
    },
    attrs: {
      tabindex: fieldInitData.tabindex,
    },
    directives: [
      {
        name: 'l',
        value: {
          [`${fieldInitData.field.$$key}.label`]: this.$t(`${fieldInitData.field.$$key}.label`),
          [`${fieldInitData.field.$$key}.hint`]: this.$t(`${fieldInitData.field.$$key}.hint`),
          [`${fieldInitData.field.$$key}.tooltip`]: this.$t(`${fieldInitData.field.$$key}.tooltip`),
          ...fieldInitData.field.enum.$$list.reduce((acc, option) => ({...acc, [option.$$key]: this.$t(option.$$key)}), {}),
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
