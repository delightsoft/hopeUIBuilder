export default function ({ fieldInitData, additionalFieldProps }) {
  const children = this.model[fieldInitData.fieldName].reduce((acc, model, index) => {
    const children = this.getChildren({
      h: this.h,
      fields: fieldInitData.field.fields.$$list,
      parent: {
        name: [...fieldInitData.parent.name || [], fieldInitData.fieldName],
        index: [...fieldInitData.parent.index || [], index],
      },
    });

    if (children.find(child => child)) {
      acc.push(
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
          ]
        )
      );
    }

    return acc;
  }, []);

  if (!children.length) return {};

  return {
    name: 'flatSubtableAsStructure',
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
    classes: ['flat-subtable-as-structure'],
    directives: [
      {
        name: 'l',
        ...fieldInitData.props.readonly && {
          value: {
            [`${fieldInitData.field.$$key}.label`]: this.$t(`${fieldInitData.field.$$key}.label`),
            [`${fieldInitData.field.$$key}.subtitle`]: this.$t(`${fieldInitData.field.$$key}.subtitle`),
            [`${fieldInitData.field.$$key}.title {index}`]: this.$t(`${fieldInitData.field.$$key}.title`),
          }
        }
      }
    ],
    children: [
      additionalFieldProps.withHeader && this.h(
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
              class: 'col-12',
              style: 'margin-bottom: 0;',
            },
            this.$t(this.$t(`${fieldInitData.field.$$key}.subtitle`)),
          ),
        ],
      ),
      ...children,
    ],
  }
}
