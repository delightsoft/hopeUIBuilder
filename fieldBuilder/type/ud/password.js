import {QIcon, QInput} from 'quasar'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'
import emulateKeyboardTabDown from '../../../utils/emulateKeyboardTabDown'
import Vue from 'vue'

export default function ({ fieldInitData, additionalFieldProps }) {
  if (!this.uiModel.hasOwnProperty(fieldInitData.fieldName))  {
    Vue.set(this.uiModel, fieldInitData.fieldName, {});
    Vue.set(this.uiModel[fieldInitData.fieldName], 'isPwd', true);
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
      type: this.uiModel[fieldInitData.fieldName].isPwd ? 'password' : 'text',
      filled: true,
    },
    attrs: {
      tabindex: fieldInitData.tabindex,
    },
    scopedSlots: {
      append: () => {
        return this.h(
          QIcon,
          {
            class: ['cursor-pointer'],
            props: {
              name: this.uiModel[fieldInitData.fieldName].isPwd ? 'visibility_off' : 'visibility',
            },
            on: {
              click: () => {
                this.uiModel[fieldInitData.fieldName].isPwd = !this.uiModel[fieldInitData.fieldName].isPwd;
              }
            }
          },
        )
      },
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
