import Vue from 'vue'
import { QIcon, QInput } from 'quasar'
import readonly from '../../components/readonly/'
import tooltip from '../../components/tooltip'
// import VuePhoneNumberInput from 'vue-phone-number-input';
// import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import errorWrapper from '../../components/errorWrapper.vue'
import VuePhoneNumberInput from 'maz-ui/lib/maz-phone-number-input'
import 'maz-ui/lib/css/index.css'
import 'maz-ui/lib/css/maz-phone-number-input.css'

export default function ({ fieldInitData, additionalFieldProps }) {
  if (!this.uiModel.hasOwnProperty(fieldInitData.fieldName)) {
    Vue.set(this.uiModel, fieldInitData.fieldName, {});
    Vue.set(this.uiModel[fieldInitData.fieldName], 'phone', "");
    Vue.set(this.uiModel[fieldInitData.fieldName], 'formatInternational', "");
    Vue.set(this.uiModel[fieldInitData.fieldName], 'e164', "");
    Vue.set(this.uiModel[fieldInitData.fieldName], 'countryCode', "");
    Vue.set(this.uiModel[fieldInitData.fieldName], 'isValid', false);
  }

  // fix broken tabindex
  let inputs = document.querySelectorAll('.maz-input__icon + .maz-input__input,  .input-phone-number .maz-input__input, .maz-input__input[name="new_search_in_options"')
  for (const key in inputs) {
    if (inputs.hasOwnProperty(key)) {
      const element = inputs[key];
      if (element.tabIndex !== fieldInitData.tabindex) {
        element.tabIndex = fieldInitData.tabindex
      }
    }
  }

  return {
    name: 'phone',
    component: errorWrapper,
    scopedSlots: {
      default: () => this.h(
        VuePhoneNumberInput,
        {
          readonlyComponent: readonly,
          on: {
            update: (value) => {
              Vue.set(this.uiModel[fieldInitData.fieldName], 'countryCode', value.countryCode);
            },
            input: fieldInitData.inputDebounce(value => {
              Vue.set(this.uiModel[fieldInitData.fieldName], 'phone', value || null);
              // fieldInitData.onInput({ phoneFormatted: this.uiModel[fieldInitData.fieldName].phone, countryCode: this.uiModel[fieldInitData.fieldName].countryCode })
              fieldInitData.onInput(this.uiModel[fieldInitData.fieldName].phone)
            })
          },
          props: {
            ...fieldInitData.props,
            'show-code-on-list': true,
            'border-radius': 8,
            color: "#f86532",
            value: null,
            'default-phone-number': this.uiModel[fieldInitData.fieldName].phone
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
      )
    }
  }
}
