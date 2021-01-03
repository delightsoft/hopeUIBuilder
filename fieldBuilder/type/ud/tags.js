import {QIcon, QSelect} from 'quasar'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'
import Vue from 'vue'

export default function ({ fieldInitData, additionalFieldProps }) {
  if (!this.uiModel.hasOwnProperty(fieldInitData.fieldName))  {
    Vue.set(this.uiModel, fieldInitData.fieldName, {});
    Vue.set(this.uiModel[fieldInitData.fieldName], 'options', null);
    Vue.set(this.uiModel[fieldInitData.fieldName], 'filteredOptions', []);
  }

  return {
    name: 'tags',
    component: QSelect,
    readonlyComponent: readonly,
    on: {
      input: fieldInitData.onInput,
      'new-value': (val, done) => {
        if (val.length > 1) {
          if (!this.uiModel[fieldInitData.fieldName].filteredOptions.includes(val)) {
            done({ label: val }, 'add-unique');
          }
        }
      },
    },
    props: {
      filled: true,
      'use-input': true,
      'use-chips': true,
      'multiple': true,
      options: [],
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
