import Vue from 'vue'
import { pick as _pick } from 'lodash'
import { QInput } from 'quasar'
import 'vue-multiselect/dist/vue-multiselect.min.css';

export default function ({ fieldInitData, additionalFieldProps }) {
  if (!this.uiModel.hasOwnProperty(fieldInitData.fieldName)) {
    Vue.set(this.uiModel, fieldInitData.fieldName, {});
  }

  // Значение
  const value = fieldInitData.model[fieldInitData.fieldName];

  // Список полей (name, key), за значениями которых компонент будет следить
  const watchFields = this.schema.$$tags['ui.skillsPositions'].list.map(i => ({ name: i.name, key: i.$$key }))
  const allowed = watchFields.map(i => i.name)
  const watchFiledsValues = _pick(this.value, allowed)

  // Свойство display определяет, должен ли компонент быть отрисован
  let display = false;
  for (const key in watchFiledsValues) {
    if (watchFiledsValues.hasOwnProperty(key)) {
      const element = watchFiledsValues[key];
      const index = value.findIndex(i => i.name === key)
      const isItemFinded = index !== -1

      if (element) {
        display = true
      }

      if (element && !isItemFinded) {
        fieldInitData.addElementInArray()
        value[value.length - 1].name = key
      }

      if (!element && isItemFinded) {
        fieldInitData.deleteElementFromArray(index)
      }
    }
  }

  return {
    name: "experienceTime",
    component: 'div',
    col: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
    },
    props: {
      filled: false,
      outlined: true
    },
    children: [
      display ? this.h(
        'h2',
        { class: "text-h6" },
        fieldInitData.props.label
      ) : null,
      ...value.map((model, index) => {
        return this.h(
          'div',
          {
            class: 'array-item col-12',
            style: {
              marginBottom: '6px'
            }
          },
          [
            this.h(
              'div',
              {
                class: 'row q-col-gutter-md',
              },
              [
                this.h(
                  QInput,
                  {
                    class: 'col-xs-12 col-sm-6 col-md-6 col-lg-6 col-xl-6',
                    props: {
                      filled: true,
                      label: 'Name',
                      value: this.$t(this.$t(`${this.schema[model.name].$$key}.label`)),
                      readonly: true
                    }
                  }
                ),
                ...this.getChildren({
                  h: this.h,
                  fields: fieldInitData.field.fields.$$list.filter(i => i.name !== 'name'),
                  parent: {
                    name: [...fieldInitData.parent.name || [], fieldInitData.fieldName],
                    index: [...fieldInitData.parent.index || [], index],
                  },
                }),
              ]
            )
          ]
        )
      })
    ]
  }
}
