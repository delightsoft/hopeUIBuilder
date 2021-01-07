import { QIcon, QSelect } from 'quasar'
import {range as _range} from 'lodash'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'

export default function ({ fieldInitData, additionalFieldProps }) {
  const min = 1950
  const max = new Date().getFullYear()
  const array = _range(min, max + 1).sort((a, b) => b - a)

  if (fieldInitData.props.value > max || fieldInitData.props.value < min) {
    fieldInitData.onInput(max)
  }

  return {
    name: 'year',
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
      filled: false,
      outlined: true,
      options: array,
      'popup-content-class': 'field-year-popup'
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
