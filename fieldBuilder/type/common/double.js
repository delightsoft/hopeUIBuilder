import { QIcon, QInput } from 'quasar'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'
import inputFilter from '../../../utils/inputFilter'
import isDouble from '../../../utils/isDouble'

export default function ({ fieldInitData, additionalFieldProps }) {
  const field = fieldInitData.field;
  const min = field.min;
  const max = field.max;
  const scale = field.extra?.scale;

  const anyDoubleRegExpWithoutScale = /^-?\d*[.]?\d*$/;
  const positiveDoubleRegExpWithoutScale = /^\d*[.]?\d*$/;
  const anyDoubleRegExpWithScale = new RegExp(`^-?\d*[.]?\d{0,${scale}}$`);
  const positiveDoubleRegExpWithScale = new RegExp(`^\d*[.]?\d{0,${scale}}$`);
  let anyDoubleRegExp;
  let positiveDoubleRegExp;
  if (scale) {
    anyDoubleRegExp = anyDoubleRegExpWithScale;
    positiveDoubleRegExp = positiveDoubleRegExpWithScale;
  } else {
    anyDoubleRegExp = anyDoubleRegExpWithoutScale;
    positiveDoubleRegExp = positiveDoubleRegExpWithoutScale;
  }

  let regExp;
  let filter;

  const checkDoubleOnMinMax = {
    name: 'checkDoubleOnMinMax',
    min,
    max,
    regExp: value => regExp.test(value),
    checkOnMax: value => parseFloat(value) <= max || value === '' || value === '-',
  };
  const checkDoubleOnMin = {
    name: 'checkDoubleOnMin',
    min,
    regExp: value => regExp.test(value),
  };
  const checkDoubleOnMax = {
    name: 'checkDoubleOnMax',
    max,
    regExp: value => regExp.test(value),
    checkOnMax: value => parseFloat(value) <= max || value === '',
  };
  const checkDouble = {
    name: 'checkDouble',
    regExp: value => regExp.test(value),
  };

  if (Number.isInteger(min) && min >= 0 && Number.isInteger(max) && max >= 0) {
    regExp = positiveDoubleRegExp;
    filter = checkDoubleOnMinMax;
  } else if (Number.isInteger(min) && !Number.isInteger(max) && min >= 0) {
    regExp = positiveDoubleRegExp;
    filter = checkDoubleOnMin;
  } else {
    regExp = anyDoubleRegExp;

    if (Number.isInteger(min) && Number.isInteger(max)) {
      filter = checkDoubleOnMinMax;
    } else if (Number.isInteger(max) && !Number.isInteger(min)) {
      filter = checkDoubleOnMax;
    } else if (!Number.isInteger(max) && Number.isInteger(min)) {
      filter = checkDoubleOnMin;
    } else {
      filter = checkDouble;
    }
  }
  return {
    name: 'double',
    component: QInput,
    readonlyComponent: readonly,
    on: {
      change: (event) => {
        if (filter.name === 'checkDoubleOnMin' || filter.name === 'checkDoubleOnMinMax') {
          let value = event.srcElement.valueAsNumber || event.srcElement.value;
          if (value === '' || value === '-' || parseFloat(value) < min) {
            let element = event.target;
            element.value = min;
          }
        }

        fieldInitData.onChange(event, { type: 'number' })
      },
      input: fieldInitData.inputDebounce(value => {
        const number = Number(value);
        if (isDouble(number) || Number.isInteger(number)) {
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
