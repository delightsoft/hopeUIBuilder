import {QIcon, QInput} from 'quasar'
import readonlyEmail from '../../components/readonly/readOnlyEmail'
import tooltip from '../../components/tooltip'
import emulateKeyboardTabDown from '../../../utils/emulateKeyboardTabDown'

export default function ({ fieldInitData, additionalFieldProps }) {
  return {
    name: 'string',
    component: QInput,
    readonlyComponent: readonlyEmail,
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
      filled: true,
      type: 'email',
    },
    attrs: {
      tabindex: fieldInitData.tabindex,
      autocomplete: 'email',
      name: 'email'
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
