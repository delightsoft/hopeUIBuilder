const debug = require('debug/dist/debug')('tableBuilder');

export default {
  createColumns: require('./createColumns').default({ debug }),
  buildRows: require('./buildRows').default({ debug }),
  buildCards: require('./buildCards').default({ debug }),
}
