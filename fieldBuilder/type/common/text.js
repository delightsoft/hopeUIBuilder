import { QInput, QIcon } from 'quasar'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'

export default function ({ fieldInitData, additionalFieldProps }) {
  return {
    name: 'text',
    component: QInput,
    readonlyComponent: readonly,
    on: {
      change: fieldInitData.onChange,
      input: fieldInitData.inputDebounce(value => fieldInitData.onInput(value, null, null, true, true)),
    },
    props: {
      outlined: true,
      type: 'textarea',
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
    },
  }
}
