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

  const userId = this.$profile.model.id;

  this._api = new APICommon;
  const ref = `autocomplete_${fieldInitData.fieldName}`
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

  let optionsFormat = i => i;
  let propTrackBy = 'docId'
  let propPlaceholder = fieldInitData.props.label || 'Select option';
  switch (additionalFieldProps.data) {
    case 'devjbs.Technology':
      optionsFormat = i => ({ label: i.label, docId: i.id })
      propPlaceholder = "Select technologies"
      break;
    case 'devjbs.WorldCity':
      optionsFormat = i => ({ label: `${i.country}, ${i.cityAscii}`, docId: i.id })
      propPlaceholder = "Select city"
      break;

    default:
      break;
  }
  let limit = 15;

  return {
    name: 'autocomplete',
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
          name: 'autocomplete',
          ref,
          on: {
            tag: async (newTag) => {
              const compo = this.$refs[ref]

              const findedTechnologies = await this._api.invoke({
                service: 'hope',
                method: 'list',
                args: {
                  type: additionalFieldProps.data,
                  filter: {
                    hardMatchByLabel: newTag
                  },
                }
              })

              let technology;
              if (findedTechnologies.data.length === 0) {
                technology = doc.fields.$$new({ edit: false })
                technology.label = newTag;
                technology.createdByUser = true;
                technology.creator = [{docId: userId}];
              } else {
                technology = findedTechnologies.data[0]
                technology.creator.push({docId: userId})
              }

              const res = await this._api.invoke({
                service: "hope",
                method: 'invoke',
                args: {
                  type: additionalFieldProps.data,
                  update: doc.fields.$$update(technology, undefined, { noRev: true })
                }
              })

              const tag = {
                label: newTag,
                docId: res.data.doc.id
              }
              this.uiModel[fieldInitData.fieldName].filteredOptions.push(tag)
              compo.value.push(tag)
            },
            'search-change': async (val) => {
              Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', true);

              // Не выполняем запрос, если строка пустая
              if (val.trim().length < 1) {
                Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', false);
                return
              }

              // Запросить данные из базы
              const formattedSearch = val.toLowerCase()
              const res = await this._api.invoke({
                service: "hope",
                method: 'list',
                args: {
                  type: additionalFieldProps.data,
                  filter: {
                    search: formattedSearch,
                    creator: userId
                  },
                  limit
                }
              })

              // Формат options для разных типов документов
              const items = res.data.map(i => optionsFormat(i))

              Vue.set(this.uiModel[fieldInitData.fieldName], 'filteredOptions', items);
              Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', false);
            },
            input: (value) => {
              // Стандартное поведение при вводе значения
              fieldInitData.onInput(value)
            },
            close: (value, id) => {
              Vue.set(this.uiModel[fieldInitData.fieldName], 'filteredOptions', []);
            }
          },
          props: {
            'placeholder': propPlaceholder,
            'hide-selected': false,
            'internal-search': true,
            'options-limit': limit,
            label: "label",
            taggable: additionalFieldProps.taggable,
            closeOnSelect: !additionalFieldProps.multiple,
            trackBy: propTrackBy,
            loading: this.uiModel[fieldInitData.fieldName].isLoading,
            options: this.uiModel[fieldInitData.fieldName].filteredOptions || [],
            internalSearch: false,
            allowEmpty: !!additionalFieldProps.multiple,
            deselectLabel: !!additionalFieldProps.multiple ? 'Press enter to remove' : '',

            multiple: !!additionalFieldProps.multiple,
            value: fieldInitData.props.value,
            error: fieldInitData.props.error,
            'error-message': fieldInitData.props['error-message'],
            tabindex: fieldInitData.tabindex,
          },
          scopedSlots: {
            noOptions: () => {
              return 'Start typing to search'
            },
            singleLabel: (value) => {

              if (value && value.option && value.option.label) {
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
                      value.option.label
                    ),
                    // requiredElement
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
