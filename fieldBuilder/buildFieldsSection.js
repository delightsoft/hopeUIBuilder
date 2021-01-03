import Vue from 'vue'
import type from './type/type'
import { isFunction, isObject, camelCase, throttle, debounce } from 'lodash'
import getColClasses from '../utils/getColClasses'

/**
 * Стандартная сетка для полей
 * */
const COL = {
  xs: 12,
  sm: 8,
  md: 8,
  lg: 7,
  xl: 7,
};

/**
 * TODO: не дергать билдер, если модель старая
 * TODO: не проходиться в цикле по всем полям, проходиться только по полям билдера
 * */
export default ({ debug }) => {
  return Vue.extend({
    name: 'FieldsSection',

    props: [
      /**
       * Схема полей
       *
       * @Example: $model.docs['auth.AuthForm'].fields
       * */
      'schema',

      /**
       * Дополнительные клиентские метаданные для полей
       *
       * @Example:
       * {
       *   login: {
       *     col: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
       *   },
       * }
       * */
      'fieldBuilderSchema',

      'view', // маска видимых полей
      'edit', // маска редактируемых полей
      'required', // маска обязательных полей
      'value', // модель схемы
      'uiModel', // ui модель
      'errors', // все ошибки валидации
      'displayedFieldsWithErrors', // ошибки валидации, которые были визиаульно отображены на форме
      'options', // дополнительные опции/переменные для полей

      /**
       * Ключи для постоения пути локализации
       *
       * @Example:
       * {
       *   apiKey: 'auth',
       *   docKey: 'AuthForm',
       * }
       * */
      'fieldsKey',

      'context', // контекст выполнения
    ],
    created() {
      this.cache = {};
      this._fieldsKey = this.fieldsKey;
      this._options = this.options;
      this._context = this.context;

      debug('created(fieldsKey: %o, options: %o, context: %o )', this._fieldsKey, this._options, this._context);
    },
    beforeUpdate() {
      this._options = this.options;

      if (this.context) this._context = this.context;
    },
    methods: {
      getChildren({ h, fields, parent = {} }) {
        for (const key in this.errors) {
          if (this.errors.hasOwnProperty(key)) {
            const message = this.errors[key];

            const splittedMessage = message.path.split(".")
            if (splittedMessage.length > 1) {
              this.errors[splittedMessage[0]] = message;
              this.errors[splittedMessage[0]].path = splittedMessage[0]
              delete this.errors[key]
            }
          }
        }

        return fields.map(field => {
          const fieldName = field.name;
          const fieldNameWithParentFieldName = [parent.name ? `${parent.name.join('.field.')}.field` : '', fieldName].filter(Boolean).join('.'); // используется для лейблов
          let fieldNameWithParentFieldNameWithIndex = parent.name?.map((name, index) => `${name}${parent.index && parent.index[index] + 1 ? `[${parent.index[index]}]`: ''}`).join('.'); // используется для ключей

          if (fieldNameWithParentFieldNameWithIndex) {
            fieldNameWithParentFieldNameWithIndex += `.${fieldName}`;
          } else {
            fieldNameWithParentFieldNameWithIndex = fieldNameWithParentFieldName;
          }

          return (this.cache[fieldNameWithParentFieldNameWithIndex] || (
            this.cache[fieldNameWithParentFieldNameWithIndex] = (() => {
              return () => {
                if (!this.view.get(field.$$index)) return; // если поля нет во view маске, значит его нужно пропустить
                const readOnly = this.edit && !this.edit.get(field.$$index); // если поля нет в edit маске, значит поле readonly

                const requiredIfStructure = (field.type === 'structure' ? (!!field.fields && field.fields.$$list.map(i => i.required).includes(true)) : (false))
                const required = !!field.required || (this.required && this.required.get(field.$$index) || requiredIfStructure); // если поле есть в required маске, значит оно required
                const model = _getModel(this.value, parent);

                const props = {
                  value: model[fieldName],
                  label: this.$t(this.$t(`${field.$$key}.label`)),
                  hint: this.$t(this.$t(`${field.$$key}.hint`)) ? this.$t(this.$t(`${field.$$key}.hint`)) : undefined,
                  required,
                  ...readOnly && { readonly: true },
                  error: (!!this.errors?.[fieldNameWithParentFieldNameWithIndex] === false ? undefined : true) || (!!this._options?.warnings?.[fieldNameWithParentFieldNameWithIndex] === false ? undefined : true),
                  'error-message': (this.errors?.[fieldNameWithParentFieldNameWithIndex]?.code ? this.$t(this.$t(this.errors?.[fieldNameWithParentFieldNameWithIndex]?.code, this.errors?.[fieldNameWithParentFieldNameWithIndex])) : this.errors?.[fieldNameWithParentFieldNameWithIndex]) || (this._options?.warnings?.[fieldNameWithParentFieldNameWithIndex]?.code ? this.$t(this.$t(this._options?.warnings?.[fieldNameWithParentFieldNameWithIndex]?.code, this._options?.warnings?.[fieldNameWithParentFieldNameWithIndex])) : this._options?.warnings?.[fieldNameWithParentFieldNameWithIndex]),
                };
                let classes = ['justify-start', camelCase(`hope ${fieldName}`)];
                let col = COL;
                const tabindex = 10;

                /**
                 * @param {boolean} system - системное присваение значения, $$touched проставлять не нужно
                 * */
                const onChange = (value, opts, system) => {
                  let _value;
                  if (typeof value === 'object' && value !== null) {
                    _value = value.srcElement.valueAsNumber || value.srcElement.value;
                  } else {
                    _value = value;
                  }

                  if (opts?.clearValue && isFunction(opts.clearValue)) {
                    _value = opts.clearValue(_value);
                  }

                  if (opts?.type === 'number') {
                    _value = Number(_value);
                  }

                  const model = _getModel(this.value, parent);
                  model[fieldName] = typeof _value === 'string' ? _value.trim() : _value;
                  if (!system && model.$$touched) {
                    Vue.set(model.$$touched, fieldName, true);
                  }

                  if (this._options.useGtm && this.$gtm.dataLayer) {
                    this.$gtm.formFieldChanged({
                      category: this._options.category,
                      name: this._options.formName,
                      fieldName,
                    })
                  }
                };
                /**
                 * @param {string} useFieldName - eсли передать аргумент useFieldName, то знаение запишется в поле модели с названием useFieldName
                 * @param {boolean} system - системное присваение значения, $$touched проставлять не нужно
                 * @param {boolean} touchedIgnore - игнорировать установку $$touched поля
                 * @param {boolean} gtmIgnore - игнорировать отправку события в GTM
                 * */
                const onInput = (value, useFieldName, system, touchedIgnore, gtmIgnore) => {
                  const model = _getModel(this.value, parent);
                  model[useFieldName || fieldName] = typeof value === 'string' ? value.trim() : value;
                  if (!system && model.$$touched && !touchedIgnore) {
                    Vue.set(model.$$touched, useFieldName || fieldName, true);
                  }

                  if (this._options.useGtm && this.$gtm.dataLayer && !gtmIgnore) {
                    this.$gtm.formFieldChanged({
                      category: this._options.category,
                      name: this._options.formName,
                      fieldName,
                    })
                  }
                };
                const addElementInArray = () => {
                  const model = _getModel(this.value, parent);
                  model[fieldName].push(field.fields.$$new({ edit: true }));
                  if (model.$$touched) {
                    Vue.set(model.$$touched, fieldName, true);
                  }
                };
                const deleteElementFromArray = (index) => {
                  const model = _getModel(this.value, parent);
                  model[fieldName].splice(index, 1);
                  if (model.$$touched) {
                    Vue.set(model.$$touched, fieldName, true);
                  }
                };

                const inputThrottle = (func, ms) => throttle(value => func(value), ms || 300, { leading: false });
                const inputDebounce = (func, ms) => debounce(value => func(value), ms || 100);

                const fieldInitData = _getAllProps({
                  onChange,
                  onInput,
                  addElementInArray,
                  deleteElementFromArray,

                  inputThrottle,
                  inputDebounce,

                  field,
                  model,
                  fieldName,
                  fieldNameWithParentFieldName,
                  fieldNameWithParentFieldNameWithIndex,
                  parent,
                  props,
                  tabindex,
                });

                const additionalFieldData = this.fieldBuilderSchema ? getAdditionalFieldData.call(this, { schema: this.fieldBuilderSchema, path: fieldNameWithParentFieldName, fieldInitData: fieldInitData }) : {}; // получение данных по конкретному полю из дополнительных клиентских метаданных

                const acceptableTypes = [additionalFieldData.typeComponent, ...field.udType || [], field.type]; // поиск подходящего типа поля
                const acceptableType = acceptableTypes.find(acceptableType => type[acceptableType]);
                if (!acceptableType) throw new Error(`Unexpected field type ${field.type}`);

                // получение данных о найденном типе
                const {
                  name: typeName,
                  component: typeComponent,
                  readonlyComponent: typeReadonlyComponent,
                  classes: typeClasses = [],
                  style: typeStyle,
                  props: typeProps,
                  col: typeCol,
                  offsetCol: typeOffsetCol,
                  on: typeOn,
                  attrs: typeAttrs,
                  domProps: typeDomProps,
                  scopedSlots: typeScopedSlots,
                  children: typeChildren,
                  directives: typeDirectives = [],
                  ref: typeRef,
                  canBeRequired: typeCanBeRequired = true, // исходно считается, что каждое поле может быть обязательным
                } = type[acceptableType].call(this, { fieldInitData, additionalFieldProps: additionalFieldData.props || {} });


                if (required && typeCanBeRequired) classes.push('required');
                if (this._options?.warnings?.[fieldNameWithParentFieldNameWithIndex]) classes.push('warning');

                // условие, когда поле НЕ нужно отображать
                if (additionalFieldData.show?.() === false) return;
                if (additionalFieldData.hideEmpty && !props?.value) return;

                if (isObject(this.displayedFieldsWithErrors) && props.error) {
                  this.displayedFieldsWithErrors[fieldNameWithParentFieldNameWithIndex] = {
                    fieldBuilderView: this.view, // для понимания к какой секции относится поле
                    field,
                    path: fieldNameWithParentFieldNameWithIndex,
                  };
                }

                typeClasses.push(`field-${typeName}`);

                return h(
                  readOnly && typeReadonlyComponent ? typeReadonlyComponent : additionalFieldData.component || typeComponent,
                  {
                    key: fieldNameWithParentFieldNameWithIndex,
                    class: [
                      ...getColClasses({ col: typeCol || additionalFieldData.col || col }),
                      ...getColClasses({ col: typeOffsetCol || additionalFieldData.offsetCol, offset: true }),
                      ...additionalFieldData.classes || [],
                      ...typeClasses,
                      ...classes,
                    ].join(' '),
                    style: { ...typeStyle },
                    props: { ...props, ...typeProps, ...additionalFieldData.props },
                    on: { ...typeOn, ...additionalFieldData.on },
                    scopedSlots: { ...typeScopedSlots, ...additionalFieldData.scopedSlots },
                    ref: typeRef,
                    attrs: {
                      ...typeAttrs,
                    },
                    domProps: typeDomProps,
                    directives: [
                      {
                        name: 'l',
                        value: {
                          [`${field.$$key}.label`]: this.$t(`${field.$$key}.label`),
                          [`${field.$$key}.hint`]: this.$t(`${field.$$key}.hint`),
                          [`${field.$$key}.tooltip`]: this.$t(`${field.$$key}.tooltip`),
                        },
                      },
                      ...typeDirectives,
                    ],
                  },
                  additionalFieldData.children || typeChildren
                )
              }
            })()
          ))();
        })
      }
    },
    render(h) {
      this.h = h;

      const children = this.getChildren({ h, fields: this.schema.$$list });
      if (!children.find(child => child)) return;

      return h(
        'div',
        {},
        [children, this.$slots.after]
      )
    }
  })
}

function _getModel(model, parent) {
  if (JSON.stringify(parent) !== '{}') {
    return parent.name.reduce((acc, name, index) => {
      acc = acc[name];
      if (parent.index[index] + 1) {
        acc = acc[parent.index[index]];
      }
      return acc;
    }, model);
  } else {
    return model;
  }
}

const _getAllProps = ({...args}) => args;

function getAdditionalFieldData({ schema, path, fieldInitData }) {
  const _p = ({ obj, pathArray, fieldInitData }) => {
    let newObj = obj[pathArray.shift()];
    if (!newObj) return;
    if (isFunction(newObj)) {
      newObj = newObj.call(this, { fieldInitData });
    }
    if (!pathArray.length) {
      return newObj;
    }
    return _p.call(this, { obj: newObj, pathArray, fieldInitData });
  };
  return _p.call(this, { obj: schema, pathArray: path.split('.'), fieldInitData }) || {};
}
