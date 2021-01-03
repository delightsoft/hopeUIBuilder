export default ({ col = {}, offset = false }) => Object.keys(col).map(colKey => `${offset ? 'offset' : 'col'}-${colKey}-${col[colKey]}`);
