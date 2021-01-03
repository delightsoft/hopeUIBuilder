import Vue from 'vue'
import { QSelect, QItem, QItemSection, QIcon } from 'quasar'
import pathExists from '../../../utils/pathExists'
import Graphql from '../../../../metadata/modules/graphql/graphql'
import tooltip from '../../components/tooltip'
import readonly from '../../components/readonly'
import { isEqual } from 'lodash'

export default function ({ fieldInitData, additionalFieldProps }) {
  if (!this.uiModel.hasOwnProperty(fieldInitData.fieldName))  {
    Vue.set(this.uiModel, fieldInitData.fieldName, {});
    Vue.set(this.uiModel[fieldInitData.fieldName], 'options', null);
    Vue.set(this.uiModel[fieldInitData.fieldName], 'filteredOptions', null);
    Vue.set(this.uiModel[fieldInitData.fieldName], 'isLoading', false);
    // Параметры дял graphql запроса
    Vue.set(this.uiModel[fieldInitData.fieldName], 'catalogVariables', null);
  }

  // если до загрузки опций в моделе имеются данные о выбранной опции
  let options = null;
  if (fieldInitData.model[fieldInitData.fieldName] && !this.uiModel[fieldInitData.fieldName].options && fieldInitData.model[additionalFieldProps.labelField]) {
    options = [
      {
        ...additionalFieldProps.optionLabel && { [additionalFieldProps.optionLabel]: fieldInitData.model[additionalFieldProps.labelField] } || { label: fieldInitData.model[additionalFieldProps.labelField] },
        ...additionalFieldProps.optionValue && { [additionalFieldProps.optionValue]: fieldInitData.model[fieldInitData.fieldName] } || { value: fieldInitData.model[fieldInitData.fieldName] },
      },
    ];
  }

  // Асинхронная подгрузка списка при инициализации
  if (!this.uiModel[fieldInitData.fieldName]?.isLoading && !this.uiModel[fieldInitData.fieldName]?.options && additionalFieldProps.isPreload) {
    this.uiModel[fieldInitData.fieldName].isLoading = true;
    const metadata = this.$model;
    const graphql = new Graphql({ metadata });
    const query = graphql.getQuerySchemaForMethod({ path: fieldInitData.field.extra.path });
    this.$apollo.query({
      query,
      ...(additionalFieldProps.catalogVariables || this._context) && {
        variables: { ...additionalFieldProps.catalogVariables, context: this._context },
      },
    }).then((result) => {
      // Получим путь до данных в ответе
      const pathToResField = graphql.getPathToResponseField({ path: fieldInitData.field.extra.path, prefix: 'data', });
      // Получим данные в ответе по пути
      const res = pathExists(result, pathToResField);

      this.uiModel[fieldName].options = res || [];
      this.uiModel[fieldName].filteredOptions = this.uiModel[fieldName].options;

      if (additionalFieldProps.asyncInitialValue !== undefined && !this.value[fieldInitData.fieldName]) {
        const option = this.uiModel[fieldInitData.fieldName].options.find(option => option[additionalFieldProps.optionValue] || option.value);

        fieldInitData.onInput(additionalFieldProps.asyncInitialValue, null, true);
        if (additionalFieldProps.linkedFields) {
          Object.entries(additionalFieldProps.linkedFields).forEach(([fieldNameKey, fieldValueKey]) => {
            fieldInitData.onInput(option[fieldValueKey], fieldNameKey, true);
          });
        }
      }

      this.uiModel[fieldInitData.fieldName].isLoading = false;
    });
  }

  return {
    name: 'catalog',
    component: QSelect,
    readonlyComponent: readonly,
    on: {
      input: (args) => {
        fieldInitData.onInput(args[additionalFieldProps.optionValue] || args.value);

        if (additionalFieldProps.linkedFields) {
          Object.entries(additionalFieldProps.linkedFields).forEach(([fieldNameKey, fieldValueKey]) => {
            fieldInitData.onInput(args[fieldValueKey], fieldNameKey);
          });
        }
      },
      filter: async (val, update, abort) => {
        const filter = (options, needle) => options.filter(opt => Object.values(opt).find(v => v?.toLowerCase?.().indexOf(needle) > -1));
        const needle = val.toLowerCase();

        // Текущие установленные параметры для graphql запроса
        const currentVariables = this.uiModel[fieldInitData.fieldName].catalogVariables;
        // catalogVariables - Параметры для graphql запроса, которые требуется установить
        // Сравним отличаются ли параметры, если да, то выполним запрос, тем самым обновив закэшированные данные
        const variablesNotChanged = isEqual(currentVariables, additionalFieldProps.catalogVariables);
        // Данные ранее не были загружены, т.е. кэш пустой, выполним graphql запрос, заполним кэш данных
        const cacheIsEmpty = this.uiModel[fieldInitData.fieldName].options === null;
        // Кэш заполнен, параметры запроса не изменились, то обновлять не требуется
        const cacheIsFull = !cacheIsEmpty && variablesNotChanged;

        // Используем закэшированные данные, если не требуется обновлять кэш
        if (cacheIsFull) {
          // already loaded
          update(
            () => {
              this.uiModel[fieldInitData.fieldName].filteredOptions = filter(this.uiModel[fieldInitData.fieldName].options, needle);
            },
            ref => {
              if (val !== '' && ref.options.length > 0 && ref.optionIndex === -1) {
                ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
                ref.toggleOption(ref.options[ref.optionIndex], true); // toggle the focused option
              }
            }
          );
          return;
        }

        // Сохраним текущие параметры запроса
        this.uiModel[fieldInitData.fieldName].catalogVariables = additionalFieldProps.catalogVariables;

        // Выполнить graphql запрос, обновить кэш данных
        const metadata = this.$model;
        const graphql = new Graphql({ metadata });
        const query = graphql.getQuerySchemaForMethod({ path: fieldInitData.field.extra.path });
        const result = await this.$apollo.query({
          query,
          ...(additionalFieldProps.catalogVariables || context) && {
            variables: { ...additionalFieldProps.catalogVariables, context },
          },
        });

        update(
          () => {
            // Получим путь до данных в ответе
            const pathToResField = graphql.getPathToResponseField({ path: fieldInitData.field.extra.path, prefix: 'data', });
            // Получим данные в ответе по пути
            const res = pathExists(result, pathToResField);
            this.uiModel[fieldInitData.fieldName].options = res || [];
            this.uiModel[fieldInitData.fieldName].filteredOptions = this.uiModel[fieldInitData.fieldName].options;
          },
          ref => {
            if (val !== '' && ref.options.length > 0 && ref.optionIndex === -1) {
              ref.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
              ref.toggleOption(ref.options[ref.optionIndex], true); // toggle the focused option
            }
          }
        );
      },
    },
    props: {
      loading: this.uiModel[fieldInitData.fieldName].isLoading,
      filled: true,
      options: this.uiModel[fieldInitData.fieldName].filteredOptions || options,
      'map-options': true,
      'input-debounce': '0',
      'use-input': true,
      'hide-selected': true,
      'fill-input': true,
      ...additionalFieldProps.disableOptions && { 'option-disable': opt => Object(opt) === opt ? !!additionalFieldProps.disableOptions.find(disableOpt => disableOpt === (opt.value || opt[additionalFieldProps.optionValue])) : true },
      ...fieldInitData.props.readonly && additionalFieldProps.labelField && { value: fieldInitData.model[fieldInitData.labelField] },
    },
    scopedSlots: {
      'no-option': () => this.h(
        QItem,
        [
          this.h(
            QItemSection,
            {
              class: ['text-italic', 'text-grey'],
            },
            this.$t('noOptions'),
          )
        ]
      ),
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
