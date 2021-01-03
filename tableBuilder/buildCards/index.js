import Vue from 'vue'
import type from './type'
import cardItem from './components/cardItem'
import pathExists from '../../utils/pathExists'
import { isFunction } from 'lodash'

export default ({ debug }) => {
  return Vue.extend({
    name: 'Cards',

    props: [
      'fields',
      'tableProps',
      'view',
      'isConsistently', // режим последовательного отображения информации в карточке - добавляет каждому элементу обертку компонентой cardItem
      'tableBuilderSchema',
    ],
    created() {
      debug('_created buildCards(fields: %o, tableProps: %o, view: %o, isConsistently: %o)', this.fields, this.tableProps, this.view, this.isConsistently);
    },
    methods: {
      getChildren({ h, fields }) {
        return fields
          .map(field => ({ ...field, order: field.extra.cardOrder || 100 }))
          .sort((a, b) => {
            if (a.order > b.order) return 1;
            if (a.order < b.order) return -1;
            return 0;
          })
          .map(field => {
            if (this.view && !this.view.get(field.$$index)) return;
            const fieldName = field.name;

            const _allProps = _getAllProps({
              _this: this,
              props: this.tableProps,
              rowKey: field.name,
              field,
              h,
              isConsistently: this.isConsistently,
            });

            const additionalField = pathExists(this.tableBuilderSchema, fieldName);
            const additionalFieldData = (isFunction(additionalField) ? additionalField(_allProps) : additionalField) || {};
            const acceptableTypes = [additionalFieldData.typeComponent, ...field.udType || [], field.type];
            // поиск подходящих типов
            const acceptableType = acceptableTypes.find(acceptableType => type[acceptableType]);
            if (!acceptableType) throw new Error(`Unexpected field type ${field.type}`);

            const {
              component,
              directives,
              children,
              scopedSlots,
              classes = [],
              style,
              props,
            } = type[acceptableType](_allProps);

            const element = h(
              additionalFieldData.component || component,
              {
                class: [...classes],
                style: { ...style },
                props: { ...props },
                directives,
                scopedSlots,
              },
              [
                children
              ],
            );

            return this.isConsistently === undefined || this.isConsistently
              ?
                h(
                  cardItem,
                  {
                    scopedSlots: {
                      label: () => h(
                        'div',
                        this.$t(this.$t(`${field.$$key}.label`))
                      ),
                      value: () => h(
                        'div',
                        {},
                        [
                          element
                        ]
                      )
                    },
                  }
                )
              :
                element
        })
      }
    },
    render(h) {
      const children = this.getChildren({ h, fields: this.fields });

      return h(
        'span',
        children
      );
    }
  })
}

const _getAllProps = ({...args}) => args;
