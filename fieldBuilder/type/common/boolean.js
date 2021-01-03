import { QIcon } from 'quasar'
import checkbox from '../../components/checkbox'
import tooltip from '../../components/tooltip'
import emulateKeyboardTabDown from '../../../utils/emulateKeyboardTabDown'

export default function ({ fieldInitData, additionalFieldProps }) {
  return {
    name: 'boolean',
    component: checkbox,
    readonlyComponent: checkbox,
    on: {
      input: fieldInitData.onInput,
        'keydown': (e) => {
        if (e.keyCode === 13) {
          emulateKeyboardTabDown();
        }
      },
    },
    props: {
      tabindex: fieldInitData.tabindex,
    },
    scopedSlots: {
      default: () => {
        return this.h(
          'div',
          {
            class: 'flex no-wrap',
          },
          [
            this.h(
              'div',
              {
                class: 'checkbox__label',
              },
              this.$t(this.$t(`${fieldInitData.field.$$key}.label`)),
            ),
            this.$t(this.$t(`${fieldInitData.field.$$key}.tooltip`)) && this.h(
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
          ]
        );
      },
    },
  }
}
