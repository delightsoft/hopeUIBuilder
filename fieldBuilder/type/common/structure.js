import { cloneDeep } from 'lodash'
import readonly from '../../components/readonly'

export default function ({ fieldInitData, additionalFieldProps }) {
  let _parent;

  if (parent) {
    _parent = cloneDeep(fieldInitData.parent);
    _parent.name = [...fieldInitData.parent.name || [], fieldInitData.fieldName]
  } else {
    _parent = {
      name: [...fieldInitData.parent.name || [], fieldInitData.fieldName],
    }
  }

  const children = this.getChildren({
    h: this.h,
    fields: fieldInitData.field.fields.$$list,
    model: fieldInitData.model,
    parent: _parent,
  });

  if (!children.filter(Boolean).length) {
    return {}
  }

  return {
    name: 'structure',
    component: 'div',
    readonlyComponent: readonly,
    classes: ['array-item', 'col-12'],
    directives: [
      {
        name: 'l',
        value: {
          [`${fieldInitData.field.$$key}.label`]: this.$t(`${fieldInitData.field.$$key}.label`),
        },
      }
    ],
    children: [
      this.h(
        'h3',
        {
          class: 'text-h7',
          style: {
            fontWeight: '500!important',
          }
        },
        this.$t(this.$t(`${fieldInitData.field.$$key}.label`)),
      ),
      this.h(
        'div',
        {
          class: 'row q-col-gutter-md',
        },
        children
      ),
    ],
  }
}
