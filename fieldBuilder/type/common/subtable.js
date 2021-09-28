import { QBtn } from 'quasar'
import readonly from '../../components/readonly/index.vue'
import draggable from 'vuedraggable'
import {
  fasAngleDoubleDown,
  fasAngleDoubleUp, fasAngleDown, fasAngleUp
} from "@quasar/extras/fontawesome-v5";
import { deepClone } from "../../../../../../../lib/hope/lib/utils";

export default function ({ fieldInitData, additionalFieldProps }) {
  if (!fieldInitData.props.value) {
    return {
      name: 'subtable',
      component: 'div',
    }
  }

  let isDragging = false

  const moveElement = (index, indexDestination) => {
    let arr = deepClone(fieldInitData.props.value);
    [arr[index], arr[indexDestination]] = [arr[indexDestination], arr[index]]
    fieldInitData.onInput(arr)
  }

  const moveButtonGenerator = (index, indexDestination, icon) => this.h(
    QBtn,
    {
      class: 'big-element',
      props: {
        color: 'primary',
        outline: true,
        unelevated: true,
        tabindex: fieldInitData.tabindex,
        icon: icon
      },
      on: {
        click: () => moveElement(index, indexDestination),
      },
    },
  )

  const fieldChildren = fieldInitData.model[fieldInitData.fieldName].map((model, index) => this.h(
    'div',
    {
      class: 'array-item col-12',
    },
    [
      !additionalFieldProps.sectionUntitled && this.h(
        'h3',
        {
          class: 'text-h6',
        },
        `${index + 1}.` + this.$t(this.$t(`${fieldInitData.field.$$key}.label`, { index: index + 1 }), { index: index + 1 })
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
            class: 'border',
            parent: {
              name: [...fieldInitData.parent.name || [], fieldInitData.fieldName],
              index: [...fieldInitData.parent.index || [], index],
            },
          }),
          !fieldInitData.props.readonly && this.h(
            'div',
            {
              class: 'col-auto',
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
                'delete',
              ),
              index > 0 && moveButtonGenerator(index, index - 1, fasAngleUp),
              index < fieldInitData.props.value.length - 1 && moveButtonGenerator(index, index + 1, fasAngleDown),
              index > 0 && moveButtonGenerator(index, 0, fasAngleDoubleUp),
              index < fieldInitData.props.value.length - 1 && moveButtonGenerator(index, fieldInitData.props.value.length - 1, fasAngleDoubleDown),
            ]
          ),
        ]
      )
    ]
  ))

  const children = [
    // !additionalFieldProps.untitled && this.h(
    //   'div',
    //   [
    //     this.h(
    //       'h3',
    //       {
    //         class: 'col-12 text-h5',
    //         style: 'margin-top: 0px; margin-bottom: 4px;',
    //       },
    //       this.$t(this.$t(`${fieldInitData.field.$$key}.label`)),
    //     ),
    //     !!fieldInitData.model[fieldInitData.fieldName]?.length || this.h(
    //       'p',
    //       {
    //         class: `col-12`,
    //         style: 'margin-bottom: 0;',
    //       }, [
    //         this.$t(this.$t(`${fieldInitData.field.$$key}.subtitle`)),
    //       ]
    //     ),
    //   ],
    // ),
    ...fieldChildren,

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
                [`${fieldInitData.field.$$key}.action.create.label`]: this.$t(`${fieldInitData.field.$$key}.action.create.label`),
              },
            }
          ],
        },
        `${fieldInitData.field.$$key} create`,
      )
      : undefined
  ]

  const subtable = {
    name: 'subtable',
    component: draggable,
    readonlyComponent: fieldInitData.props.value.length > 0 ? undefined : readonly,
    col: {
      xs: 12,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
    },
    on: {
      start: () => {
        isDragging = true
      },
      end: () => {
        isDragging = false
      },
      input: fieldInitData.inputDebounce(value => {
        fieldInitData.onInput(value)
      }),
    },
    props: {
      filled: true,
      move: ({ relatedContext, draggedContext }) => {
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        return draggedElement && relatedElement;
      }
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
    children: children
  }

  return subtable
}
