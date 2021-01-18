import { QBtn } from 'quasar'
import readonly from '../../components/readonly/index.vue'

export default function ({ fieldInitData, additionalFieldProps }) {
  return {
    name: 'subtable',
    component: 'div',
    readonlyComponent: fieldInitData.props.value.length > 0 ? undefined : readonly,
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
      !additionalFieldProps.untitled && this.h(
        'div',
        [
          this.h(
            'h3',
            {
              class: 'col-12 text-h6',
              style: 'margin-top: 0px; margin-bottom: 4px;',
            },
            this.$t(this.$t(`${fieldInitData.field.$$key}.label`)),
          ),
          !!fieldInitData.model[fieldInitData.fieldName]?.length || this.h(
            'p',
            {
              class: `col-12`,
              style: 'margin-bottom: 0;',
            }, [
            this.$t(this.$t(`${fieldInitData.field.$$key}.subtitle`)),
          ]
          ),
        ],
      ),
      ...fieldInitData.model[fieldInitData.fieldName].map((model, index) => this.h(
        'div',
        {
          class: 'array-item col-12',
        },
        [
          !additionalFieldProps.sectionUntitled && this.h(
            'h3',
            {
              class: 'text-h7',
            },
            this.$t(this.$t(`${fieldInitData.field.$$key}.title`, { index: index + 1 }), { index: index + 1 })
          ),
          this.h(
            'div',
            {
              class: 'row q-col-gutter-md',
            },
            [
              ...this.getChildren({
                h: this.h,
                fields: fieldInitData.field.fields.$$list,
                parent: {
                  name: [...fieldInitData.parent.name || [], fieldInitData.fieldName],
                  index: [...fieldInitData.parent.index || [], index],
                },
              }),
              !fieldInitData.props.readonly && this.h(
                'div',
                {
                  class: 'col-12',
                },
                [
                  this.h(
                    QBtn,
                    {
                      class: 'big-element',
                      props: {
                        color: 'primary',
                        outline: true,
                        unelevated: true,
                        tabindex: fieldInitData.tabindex,
                      },
                      on: {
                        click: () => fieldInitData.deleteElementFromArray(index),
                      },
                      directives: [
                        {
                          name: 'l',
                          value: {
                            [`${fieldInitData.field.$$key}.button.delete.label`]: this.$t(`${fieldInitData.field.$$key}.button.delete.label`),
                          },
                        }
                      ],
                    },
                    this.$t(this.$t(`${fieldInitData.field.$$key}.button.delete.label`)),
                  ),
                ]
              ),
            ]
          )
        ]
      )),

      !fieldInitData.props.readonly && (fieldInitData.model[fieldInitData.fieldName]?.length < additionalFieldProps.elementsLimit || !additionalFieldProps.elementsLimit) ?
        this.h(
          QBtn,
          {
            class: 'col-12 big-element',
            style: 'margin-bottom: 20px; margin-top: 20px;',
            props: {
              color: 'primary',
              outline: true,
              unelevated: true,
              tabindex: fieldInitData.tabindex,
            },
            on: {
              click: fieldInitData.addElementInArray,
            },
            directives: [
              {
                name: 'l',
                value: {
                  [`${fieldInitData.field.$$key}.`action.create.label`]: this.$t(`${fieldInitData.field.$$key}.action.create.label`),
                },
              }
            ],
          },
          this.$t(this.$t(`${fieldInitData.field.$$key}.action.create.label`)),
        )
        : undefined
    ]
  }
}
