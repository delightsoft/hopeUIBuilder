import { QIcon } from 'quasar'
import toggle from '../../components/toggle'
import tooltip from '../../components/tooltip'
import emulateKeyboardTabDown from '../../../utils/emulateKeyboardTabDown'

export default function ({ fieldInitData, additionalFieldProps }) {
  return {
    name: 'toggle',
    component: toggle,
    readonlyComponent: toggle,
    on: {
      input: fieldInitData.onInput,
      'keydown': (e) => {
        if (e.keyCode === 13) {
          emulateKeyboardTabDown();
        }
      },
    },
    classes: ['text-primary'],
    props: {
      value: fieldInitData.model[fieldInitData.fieldName],
      color: 'primary',
      always: true,
      'show-active-label': true,
      trueLabel: this.$t(`${fieldInitData.field.$$key}.true.label`),
      falseLabel: this.$t(`${fieldInitData.field.$$key}.false.label`),
      tabindex: fieldInitData.tabindex,
    },
    directives: [
      {
        name: 'l',
        value: {
          [`${fieldInitData.field.$$key}.true.label`]: this.$t(`${fieldInitData.field.$$key}.true.label`),
          [`${fieldInitData.field.$$key}.false.label`]: this.$t(`${fieldInitData.field.$$key}.false.label`),
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
    },
  }
}
