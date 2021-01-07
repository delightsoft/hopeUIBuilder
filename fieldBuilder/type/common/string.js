import {QIcon, QInput} from 'quasar'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'
import emulateKeyboardTabDown from '../../../utils/emulateKeyboardTabDown'
export default function ({ fieldInitData, additionalFieldProps }) {
  let linkFormatting = function(value) {
    return value ? `<a href="${value}">${value}</a>` : '—'
  }

  let readOnlyFormatting = function() {
    if (additionalFieldProps.readOnlyFormatting) return additionalFieldProps.readOnlyFormatting;
    if (fieldInitData.field.udType?.length > 0) {
      return fieldInitData.field.udType.includes('websiteLink') ? linkFormatting : undefined
    }
    return undefined
  }

  return {
    name: 'string',
    component: QInput,
    readonlyComponent: readonly,
    on: {
      change: fieldInitData.onChange,
      input: fieldInitData.inputDebounce(value => fieldInitData.onInput(value, null, null, true, true)),
      'keydown': (e) => {
        if (e.keyCode === 13) {
          emulateKeyboardTabDown();
        }
      },
    },
    props: {
      filled: false,
      outlined: true,
      readOnlyFormatting: readOnlyFormatting()
    },
    attrs: {
      tabindex: fieldInitData.tabindex,
      placeholder: this.$te(`${fieldInitData.field.$$key}.placeholder`) ? this.$t(this.$t(`${fieldInitData.field.$$key}.placeholder`)) : '',
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
