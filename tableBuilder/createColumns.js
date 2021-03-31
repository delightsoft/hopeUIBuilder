export default ({debug}) => {
  return ({fields, view, _this, sortingOptions = [], fieldsKey = {}}) => {
    if (!fields) throw new Error('Unexpected fields');
    debug('createColumns({ fields: %o })', fields);

    let columns = [];
    const allVisibleColumns = _this.$q.localStorage.getItem('visibleColumns') || {};
    const visibleColumns = allVisibleColumns[[fieldsKey.apiKey, fieldsKey.docKey].join('.')] || null;

    fields.forEach((field) => {
      const sortingOpts = sortingOptions.find(sortingOptions => sortingOptions._value === field.name);
      if (view && !view.get(field.$$index)) return;
      if (!field.type) throw new Error('Field must contain type property');
      const canBeHidden = field.extra && field.extra.hasOwnProperty('canBeHidden') ? field.extra.canBeHidden : true;
      const col = {
        name: field.name,
        field: field.name,
        label: field.name, // `${field.$$key}.label`,
        key: `${field.$$key}.label`,
        order: (field.extra && field.extra.colOrder) || 100,
        sortable: true,
        isSortable: !!sortingOpts,
        ...sortingOpts,
        isHidden: canBeHidden && Array.isArray(visibleColumns) ? !visibleColumns.find(col => col === field.name) : false,
        canBeHidden,
        type: field.type,
        required: field.required
      };
      switch (field.type) {
        case 'string':
        case 'text':
        case 'boolean':
        case 'enum':
        case 'nanoid':
        case 'structure':
        case 'subtable':
        case 'docid':
        case 'json':
          col.align = 'left';
          break;
        case 'decimal':
        case 'integer':
        case 'double':
        case 'timestamp':
        case 'time': // local
        case 'date': // UTC
        case 'dateonly': // local
        case 'now':
        case 'refers':
          col.align = 'right';
          break;
        default:
          throw new Error(`Unexpected field type ${field.type}`);
      }

      columns.push(col);
    });

    debug('createColumns(): %o', columns);
    return columns.sort((a, b) => {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });
  }
}
