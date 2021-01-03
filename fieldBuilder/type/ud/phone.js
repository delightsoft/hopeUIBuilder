import {QIcon, QInput} from 'quasar'
import readonly from '../../components/readonly/'
import tooltip from '../../components/tooltip'
import emulateKeyboardTabDown from '../../../utils/emulateKeyboardTabDown'

export default function ({ fieldInitData, additionalFieldProps }) {
  return {
    name: 'phone',
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
    props: { filled: true },
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
