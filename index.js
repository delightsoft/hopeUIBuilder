const debug = require('debug')('hopeUiBuilder');

export default {
  buildFieldsSection: require('./fieldBuilder/buildFieldsSection').default({ debug }),
  formWrapper: import('./fieldBuilder/components/formWrapper'),

  createColumns: require('./tableBuilder/createColumns').default({ debug }),
  buildRows: require('./tableBuilder/buildRows').default({ debug }),
  buildCards: require('./tableBuilder/buildCards').default({ debug }),
}
