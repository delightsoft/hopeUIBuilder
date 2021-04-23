import {QIcon, QSelect} from 'quasar'
import readonly from '../../components/readonly'
import tooltip from '../../components/tooltip'
import Vue from "vue";
import APICommon from "src/lib/APICommon";
import errorWrapper from "src/lib/hopeUIBuilder/fieldBuilder/components/errorWrapper";

export default function ({fieldInitData, additionalFieldProps}) {
  const filterFn = async  (val, update, abort) => {
    this.query = val
    if (!val || val.length < 6) {
      this.options = []
      abort()
      return
    }
    this.options = await this.search(val)
    update()
  }

  const fillFilteredOptions = async ({search, pageNo, pageSize = 3}) => {
    Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', true);

    const filter = {}

    if (!search) {
      search = this.uiModel[fieldInitData.fieldName].search
    }

    if (search) {
      Object.assign(filter, {search})
    }

    const res = await this._api.invoke({
      service: 'hope',
      method: 'list',
      args: {
        type: fieldInitData.field.refers[0].$$key,
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
        QSelect,
        {
          name: 'refers',
          ref,
          readonlyComponent: readonly,
          on: {
            input: fieldInitData.onInput,
            filter: fillFilteredOptions,
          },
          props: {

            placeholder: propPlaceholder,
            loading: this.uiModel[fieldInitData.fieldName].isLoading,
            clearable: true,
            standout: true,
            emitValue: true,
            mapOptions: true,

            hideDropdownIcon: true,
            filled: false,
            outlined: true,
            hideSelected: true,
            useInput: true,
            inputDebounce: 1000,
            inputClass: 'text-white',
            fillInput: true,
            bgColor: 'primary',

            optionLabel: 'label',
            optionValue: 'value',
            optionsDense: true,
            options: [
              ...fieldInitData.field.enum.$$list.reduce((acc, option) => {
                if (!option.extra || !option.extra.hasOwnProperty('selectable') || option.extra.selectable)
                  acc.push(
                    {
                      label: this.$t(this.$t(option.$$key)),
                      value: option.name,
                    });
                return acc;
              }, []),
            ],
            ...fieldInitData.props.readonly && {value: this.$t(this.$t(fieldInitData.field.enum.$$list.find(option => fieldInitData.model[fieldInitData.fieldName] === option.name)?.$$key))},
          },
          attrs: {
            tabindex: fieldInitData.tabindex,
          },
          directives: [
            {
              name: 'l',
              value: {
                [`${fieldInitData.field.$$key}.label`]: this.$t(`${fieldInitData.field.$$key}.label`),
                [`${fieldInitData.field.$$key}.hint`]: this.$t(`${fieldInitData.field.$$key}.hint`),
                [`${fieldInitData.field.$$key}.tooltip`]: this.$t(`${fieldInitData.field.$$key}.tooltip`),
                ...fieldInitData.field.enum.$$list.reduce((acc, option) => ({
                  ...acc,
                  [option.$$key]: this.$t(option.$$key)
                }), {}),
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
          }
        }
      )
    }
  }
}

