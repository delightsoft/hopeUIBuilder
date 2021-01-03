import { QIcon, QField } from 'quasar'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'

export default function ({ fieldInitData, additionalFieldProps }) {
  const field = fieldInitData.field;
  const extra = field.extra;
  const min = field.min;
  const max = field.max;

  let allowNegative = true;
  if (Number.isInteger(min) && min >= 0 && Number.isInteger(max) && max >= 0) {
    allowNegative = false;
  } else if (Number.isInteger(min) && !Number.isInteger(max) && min >= 0) {
    allowNegative = false;
  }

  return {
    name: 'moneyDouble',
    component: QField,
    readonlyComponent: readonly,
    props: {
      filled: true,
    },
    on: {
      focus: () => {
        this.$refs[fieldInitData.fieldNameWithParentFieldNameWithIndex].$el.focus();
      },
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
      control: ({ id, floatingLabel, value, emitValue }) => {
        return this.h(
          'currency-input',
          {
            class: ['q-field__input'],
            attrs: {
              tabindex: fieldInitData.tabindex,
            },
            props: {
              'distraction-free': {
                hideNegligibleDecimalDigits: true,
                hideCurrencySymbol: false,
                hideGroupingSymbol: false,
              },
              currency: {
                suffix: additionalFieldProps.moneySuffix,
              },
              value,
              ...!additionalFieldProps.withoutRange && {
                'value-range': {
                  min,
                  max,
                }
              },
              'allow-negative': allowNegative,
            },
            ref: fieldInitData.fieldNameWithParentFieldNameWithIndex,
            on: {
              change: value => fieldInitData.onChange(value),
              input: fieldInitData.inputDebounce(value => fieldInitData.onInput(value, null, null, true, true)),
            },
          }
        )
      },
    }
  }
}
