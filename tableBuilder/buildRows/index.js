import Vue from 'vue'
import { QTr, QTd } from 'quasar'
import type from './type'
import goTo from '../../utils/goTo'
import pathExists from "../../utils/pathExists";
import {isFunction} from "lodash";

export default ({ debug }) => {
  return Vue.extend({
    name: 'Rows',

    props: [
      'fields',
      'tableProps',
      'columns',
      'goToPath',
      'tableBuilderSchema',
    ],
    created() {
      debug('_created buildRows(fields: %o, tableProps: %o, columns: %o)', this.fields, this.tableProps, this.columns);
    },
    methods: {
      getChildren({ h, fields, columns }) {
        return columns.map(col => {
          const field = fields[col.field];
          if (!field) {
            if (this.$scopedSlots.hasOwnProperty(col.field)) {
              return h(
                QTd,
                [
                  this.$scopedSlots[col.field]({ props: this.tableProps })
                ]
              );
            } else {
              return;
            }
          }

          const fieldName = field.name;

          const _allProps = _getAllProps({
            _this: this,
            props: this.tableProps,
            rowKey: field.name,
            field,
            h,
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

          classes.push(col.align === 'left' ? 'text-left' : 'text-right');

          return h(
            QTd,
            {
              style: {
                'cursor': 'pointer',
              },
              on: {
                ...this.goToPath && {
                  click: (e) => {
                    const props = this.tableProps;
                    goTo.call(this, e, { path: this.goToPath })
                  }
                }
              }
            },
            [
              h(
                additionalFieldData.component || component,
                {
                  class: ['cell', 'cursor-pointer', ...classes],
                  style: { ...style },
                  props: { ...props },
                  directives,
                  scopedSlots,
                },
                [
                  children
                ]
              )
            ]
          );
        });
      }
    },
    render(h) {
      const children = this.getChildren({ h, fields: this.fields, columns: this.columns });

      return h(
        QTr,
        {
          attrs: this.$attrs,
          on: this.$listeners,
          props: this.tableProps,
        },
        children
      )
    }
  })
}

const _getAllProps = ({...args}) => args;
