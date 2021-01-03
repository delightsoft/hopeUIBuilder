export default {
  string: require('./common/string').default,
  text: require('./common/text').default,
  boolean: require('./common/boolean').default,
  integer: require('./common/integer').default,
  decimal: require('./common/decimal').default,
  double: require('./common/double').default,
  time: require('./common/time').default,
  timestamp: require('./common/timestamp').default,
  date: require('./common/date').default,
  now: require('./common/now').default,
  enum: require('./common/enum').default,

  'email': require('./ud/email').default,
}
