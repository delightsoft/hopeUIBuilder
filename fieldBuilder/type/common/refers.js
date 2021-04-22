import readonly from '../../components/readonly'
import Vue from 'vue'
import APICommon from '../../../../APICommon'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import errorWrapper from '../../components/errorWrapper.vue'

export default function ({ fieldInitData, additionalFieldProps }) {

  if (!this.uiModel.hasOwnProperty(fieldInitData.fieldName)) {
    Vue.set(this.uiModel, fieldInitData.fieldName, {});
    Vue.set(this.uiModel[fieldInitData.fieldName], 'options', null);
    Vue.set(this.uiModel[fieldInitData.fieldName], 'filteredOptions', []);
    Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', false);
  }

  this._api = new APICommon;

  const ref = `refers_${fieldInitData.fieldName}`
  const doc = this.$model.docs[additionalFieldProps.data]

  const requiredElement = this.h(
    'div',
    {
      style: {
        color: 'red',
        marginLeft: '0'
      },
    },
    `${fieldInitData.props.required ? '*' : ''}`
  )

  let propPlaceholder = additionalFieldProps.propPlaceholder || fieldInitData.props.label || 'Select option';

  return {
    name: 'refers',
    component: errorWrapper,
    readonlyComponent: readonly,
    props: {
      error: fieldInitData.props.error,
      'error-message': fieldInitData.props['error-message'],
      hint: fieldInitData.props.hint,
      readonlyWithoutDefaultSlot: true
    },
    scopedSlots: {
      default: () => this.h(
        Multiselect,
        {
          name: 'refers',
          ref,
          on: {
            'search-change': async (val) => {
              Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', true);

              if (!val.trim().length) {
                Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', false);
                return
              }

              const res = await this._api.invoke({
                service: 'hope',
                method: 'list',
                args: {
                  type: fieldInitData.field.refers[0].$$key,
                  filter: { search: val.toLowerCase() },
                  limit: 15
                }
              })

              const items = res.data
              console.log(items)
              Vue.set(this.uiModel[fieldInitData.fieldName], 'filteredOptions', items);
              Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', false);
            },
            open: async (val) => {
              Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', true);

              console.log(555, fieldInitData.field.refers[0].$$key, fieldInitData)

              const res = await this._api.invoke({
                service: 'hope',
                method: 'list',
                args: {
                  type: fieldInitData.field.refers[0].$$key,
                  limit: 15
                }
              })

              const items = res.data
              Vue.set(this.uiModel[fieldInitData.fieldName], 'filteredOptions', items);
              Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', false);
            },
            input: (value) => {
              fieldInitData.onInput(value)
              Object.assign(fieldInitData.props, { value })
            },
            close: (value, id) => {
              this.$set(this.uiModel[fieldInitData.fieldName], 'filteredOptions', ['hues']);
            },
          },
          props: {
            placeholder: propPlaceholder,
            'hide-selected': false,
            'internal-search': true,
            label: 'label',
            // 'options-limit': 20,
            taggable: additionalFieldProps.taggable,
            closeOnSelect: true,
            loading: this.uiModel[fieldInitData.fieldName].isLoading,
            options: this.uiModel[fieldInitData.fieldName].filteredOptions || [],
            internalSearch: false,
            allowEmpty: !!additionalFieldProps.multiple,
            deselectLabel: !!additionalFieldProps.multiple ? 'Press enter to remove' : '',

            value: fieldInitData.props.value,
            // error: fieldInitData.props.error,
            // 'error-message': fieldInitData.props['error-message'],
            // tabindex: fieldInitData.tabindex,
          },
          scopedSlots: {
            noOptions: () => {
              return 'Start typing to search'
            },
            singleLabel: (value) => {
              console.log(333, value)
              const val = value.option
              if (val && val.label) {
                return this.h(
                  'div',
                  {
                    style: {
                      display: 'flex'
                    }
                  },
                  [
                    this.h(
                      'div',
                      {
                        style: {
                          marginBottom: '-3px',
                          marginRight: '4px',
                          padding: '4px 10px 4px 10px',
                          lineHeight: '14px',
                        },
                        class: ['multiselect__tag']
                      },
                      val.label
                    ),
                  ]
                )
              }

              return this.h(
                'div',
                {
                  style: {
                    display: 'flex',
                    color: '#adadad',
                  },
                },
                [propPlaceholder, fieldInitData.props.required ? requiredElement : '']
              )
            },
            placeholder: (value) => {
              return this.h(
                'div',
                {
                  style: {
                    display: 'flex'
                  },
                },
                [propPlaceholder, fieldInitData.props.required ? requiredElement : '']
              )
            }
          }
        }
      ),
    }
  }
}
