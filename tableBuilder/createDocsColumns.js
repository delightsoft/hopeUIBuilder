
export default ({ debug }) => {
  return ({ docs, view, _this, sortingOptions = [], fieldsKey = {} }) => {
    if (!docs) throw new Error('Unexpected docs');
    debug('createDocsCols({ docs: %o })', docs);

    let columns = [];
    // const allVisibleColumns = _this.$q.localStorage.getItem('visibleColumns') || {};
    // const visibleColumns = allVisibleColumns[[fieldsKey.apiKey, fieldsKey.docKey].join('.')] || null;
    //
    docs.forEach((doc) => {
      const sortingOpts = sortingOptions.find(sortingOptions => sortingOptions._value === doc.name);
      // if (view && !view.get(doc.$$index)) return;
      if (!doc.fields) throw new Error('Field must contain type fields');
      // const canBeHidden = doc.hasOwnProperty('extra') && doc.extra.hasOwnProperty('canBeHidden') ? doc.extra.canBeHidden : true;
      const col = {
        name: doc.name.split('.')[1],
        field: doc.name,
        key: doc.name,
        label: `${doc.$$key}.label`,
        // order: (doc.extra && doc.extra.colOrder) || 100,
        // isSortable: !!sortingOpts,
        // ...sortingOpts,
        // isHidden: canBeHidden && Array.isArray(visibleColumns) ? !visibleColumns.find(col => col === doc.name) : false,
        // canBeHidden,
      };
      // switch (doc.type) {
      //   case 'nanoid':
      //   case 'string':
      //   case 'text':
      //   case 'json':
      //   case 'boolean':
      //   case 'enum':
      //     col.align = 'left';
      //     break;
      //   case 'decimal':
      //   case 'integer':
      //   case 'double':
      //   case 'time': // local
      //   case 'timestamp':
      //   case 'date': // UTC
      //   case 'dateonly': // local
      //   case 'now':
      //     col.align = 'right';
      //     break;
      //   default:
      //     throw new Error(`Unexpected field type ${doc.type}`);
      // }

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
