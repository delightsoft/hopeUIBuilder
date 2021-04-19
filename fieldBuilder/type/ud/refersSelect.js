import readonly from '../../components/readonly'
import Vue from 'vue'
import APICommon from '../../../../APICommon'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import errorWrapper from '../../components/errorWrapper.vue'

// нужен для хранения полного объекта, после того как в onInput передается лишь id
const fullObject = {}

export default function ({ fieldInitData, additionalFieldProps }) {

  if (!this.uiModel.hasOwnProperty(fieldInitData.fieldName)) {
    Vue.set(this.uiModel, fieldInitData.fieldName, {});
    Vue.set(this.uiModel[fieldInitData.fieldName], 'options', null);
    Vue.set(this.uiModel[fieldInitData.fieldName], 'filteredOptions', []);
    Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', false);
  }

  Object.assign(fullObject, fieldInitData.props.value)

  this._api = new APICommon;
  const ref = `refersSelect_${fieldInitData.fieldName}`
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
    name: 'refersSelect',
    component: errorWrapper,
    readonlyComponent: readonly,
    props: {
      error: fieldInitData.props.error,
      'error-message': fieldInitData.props['error-message'],
      hint: fieldInitData.props.hint,
      readonlyWithoutDefaultSlot: true
    },
    data() {
      return {
        fullObject: {},
      }
    },
    scopedSlots: {
      default: () => this.h(
        Multiselect,
        {
          name: 'refersSelect',
          ref,
          on: {
            tag: async (newTag) => {
              const compo = this.$refs[ref]

              const entities = await this._api.invoke({
                service: 'hope',
                method: 'list',
                args: {
                  type: additionalFieldProps.data,
                  filter: {
                    hardMatchByLabel: newTag
                  },
                }
              })

              let entity = { label: 'Не назначено' };

              if (entities.data.length === 0) {
                entity = doc.fields.$$new({ edit: false })
                entity.label = newTag;
              } else {
                entity = entities.data[0]
              }


              const res = await this._api.invoke({
                service: 'hope',
                method: 'invoke',
                args: {
                  type: additionalFieldProps.data,
                  update: doc.fields.$$update(entity, undefined, { noRev: true })
                }
              })

              const tag = {
                label: newTag,
                id: res.data.doc.id
              }
              this.uiModel[fieldInitData.fieldName].filteredOptions.push(tag)
              compo.value.push(tag)
            },
            'search-change': async (val) => {
              Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', true);

              const filter = {}

              if (val.trim().length) {
                Object.assign(filter, { search: val.toLowerCase() })
              }

              const res = await this._api.invoke({
                service: 'hope',
                method: 'list',
                args: {
                  type: additionalFieldProps.data,
                  filter,
                }
              })

              const items = res.data
              Vue.set(this.uiModel[fieldInitData.fieldName], 'filteredOptions', items);
              Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', false);
            },
            input: (value) => {
              fieldInitData.onInput(value.id)
              Object.assign(fullObject, value)
            },
            close: (value, id) => {
              this.$set(this.uiModel[fieldInitData.fieldName], 'filteredOptions', ['hues']);
            },
          },
          props: {
            placeholder: propPlaceholder,
            'hide-selected': false,
            'internal-search': true,
            // searchable: false,
            label: 'label',
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
              if (fullObject && fullObject.label) {
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
                      fullObject.label
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
