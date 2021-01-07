import { QIcon, QInput } from 'quasar'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'
import inputFilter from '../../../utils/inputFilter'

export default function ({ fieldInitData, additionalFieldProps }) {
  const field = fieldInitData.field;
  const extra = field.extra;
  const min = field.min;
  const max = field.max;

  const anyIntegerRegExp = /^-?\d*$/;
  const positiveIntegerRegExp = /^\d*$/;
  let regExp;
  let filter;

  const checkIntegerOnMinMax = {
    name: 'checkIntegerOnMinMax',
    min,
    max,
    regExp: value => regExp.test(value),
    checkOnMax: value => parseInt(value) <= max || value === '' || value === '-',
  };
  const checkIntegerOnMin = {
    name: 'checkIntegerOnMin',
    min,
    regExp: value => regExp.test(value),
  };
  const checkIntegerOnMax = {
    name: 'checkIntegerOnMax',
    max,
    regExp: value => regExp.test(value),
    checkOnMax: value => parseInt(value) <= max || value === '',
  };
  const checkInteger = {
    name: 'checkInteger',
    regExp: value => regExp.test(value),
  };

  if (Number.isInteger(min) && min >= 0 && Number.isInteger(max) && max >= 0) {
    regExp = positiveIntegerRegExp;
    filter = checkIntegerOnMinMax;
  } else if (Number.isInteger(min) && !Number.isInteger(max) && min >= 0) {
    regExp = positiveIntegerRegExp;
    filter = checkIntegerOnMin;
  } else {
    regExp = anyIntegerRegExp;

    if (Number.isInteger(min) && Number.isInteger(max)) {
      filter = checkIntegerOnMinMax;
    } else if (Number.isInteger(max) && !Number.isInteger(min)) {
      filter = checkIntegerOnMax;
    } else if (!Number.isInteger(max) && Number.isInteger(min)) {
      filter = checkIntegerOnMin;
    } else {
      filter = checkInteger;
    }
  }

  return {
    name: 'integer',
    component: QInput,
    readonlyComponent: readonly,
    on: {
      change: (event) => {
        if (filter.name === 'checkIntegerOnMin' || filter.name === 'checkIntegerOnMinMax') {
          let value = event.srcElement.valueAsNumber || event.srcElement.value;
          if (value === '' || value === '-' || parseInt(value) < min) {
            let element = event.target;
            element.value = min;
          }
        }

        fieldInitData.onChange(event, { type: 'number' })
      },
      input: fieldInitData.inputDebounce(value => {
        const number = Number(value);
        if (Number.isInteger(number)) {
          fieldInitData.onInput(number, null, null, true, true)
        }
      }),
      ...inputFilter.call(this, filter),
    },
    props: {
      filled: false,
      outlined: true,
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
