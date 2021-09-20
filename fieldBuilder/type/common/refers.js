import Vue from 'vue'
import APICommon from '../../../../APICommon'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css';
import { QOptionGroup } from "quasar";

export default function ({ fieldInitData, additionalFieldProps }) {

  const getType = () => {
    return fieldInitData.model[fieldInitData.fieldName]?._type || fieldInitData.field.refers[0].$$key
  }

  const fillFilteredOptions = async ({ search, pageNo, pageSize = 7, docType }) => {
    Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', true);

    const filter = {}

    if (!search) {
      search = this.uiModel[fieldInitData.fieldName].search
    }

    if (search) {
      Object.assign(filter, { search })
    }

    const res = await this._api.invoke({
      service: 'hope',
      method: 'list',
      args: {
        type: docType,
        filter,
        pageNo,
        pageSize,
        order: {
          asc: true
        }
      }
    })

    const items = res.data.docs
    Vue.set(this.uiModel[fieldInitData.fieldName], 'filteredOptions', items);
    Vue.set(this.uiModel[fieldInitData.fieldName], 'pageNo', pageNo);
    Vue.set(this.uiModel[fieldInitData.fieldName], 'isLast', res.data.last);
    Vue.set(this.uiModel[fieldInitData.fieldName], 'search', search);
    Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', false);
  }

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

  const refers = () => {
    return this.h(
      Multiselect,
      {
        name: 'refSelect',
        ref,
        on: {
          'search-change': async (val) => {
            if (!val.trim().length) {
              Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', false);
              return
            }
            fillFilteredOptions({
              search: val.toLowerCase(),
              pageNo: 1,
              docType: getType()
            })
          },
          open: async (val) => {
            fillFilteredOptions({ pageNo: 1, docType: getType() })
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
          'options-limit': 20,
          taggable: additionalFieldProps.taggable,
          closeOnSelect: true,
          loading: this.uiModel[fieldInitData.fieldName].isLoading,
          options: this.uiModel[fieldInitData.fieldName].filteredOptions || [],
          internalSearch: false,
          allowEmpty: !!additionalFieldProps.multiple,
          deselectLabel: !!additionalFieldProps.multiple ? 'Press enter to remove' : '',
          disable: !!getType(),
          value: fieldInitData.props.value,
        },
        scopedSlots: {
          noOptions: () => {
            return 'Start typing to search'
          },
          singleLabel: (value) => {
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
          },
          afterList: (value) => {
            if (this.uiModel[fieldInitData.fieldName].isLast) {
              return
            }
            return this.h(
              'button',
              {
                style: {
                  width: '100%',
                },
                on: {
                  click: async () => {
                    fillFilteredOptions({
                      pageNo: ++this.uiModel[fieldInitData.fieldName].pageNo,
                      docType: getType()
                    })
                  }
                }
              },
              '>>'
            )
          },
          beforeList: (value) => {
            if (this.uiModel[fieldInitData.fieldName].pageNo === 1) {
              return
            }
            return this.h(
              'button',
              {
                style: {
                  width: '100%',
                },
                on: {
                  click: async () => {
                    fillFilteredOptions({
                      pageNo: --this.uiModel[fieldInitData.fieldName].pageNo,
                      docType: getType()
                    })
                  }
                }
              },
              '<<'
            )
          }
        }
      }
    )
  }

  const optionGroup = () => {
    return !(fieldInitData.field.refers.length === 1) && this.h(
      QOptionGroup,
      {
        name: 'refOptions',
        ref,
        on: {
          input: (value) => {
            fieldInitData.model[fieldInitData.fieldName]._type = value
          },
        },
        props: {
          label: 'label',
          options: fieldInitData.field.refers.map(item => {
            return {
              label: item.$$key,
              value: item.$$key
            }
          }),
          value: getType(),
        },
      }
    )
  }

  return {
    name: 'refers',
    component: 'div',
    col: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
    },
    props: {
      filled: true,
    },
    directives: [
      {
        name: 'l',
        value: {
          [`${fieldInitData.field.$$key}.label`]: this.$t(`${fieldInitData.field.$$key}.label`),
          [`${fieldInitData.field.$$key}.subtitle`]: this.$t(`${fieldInitData.field.$$key}.subtitle`),
          [`${fieldInitData.field.$$key}.title {index}`]: this.$t(`${fieldInitData.field.$$key}.title`),
        },
      }
    ],
    children: [
      optionGroup(),
      refers()
    ],
  }
}
