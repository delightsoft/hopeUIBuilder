/**
 *  Get the value of an object along the path.
 *  @param {object} obj - object
 *  @param {string} path - path
 *  @param {*} [defaultValue] - default value
 */
export default function pathExists(obj, path, defaultValue) {

  const returnValue = (value) => {
    if (typeof defaultValue === 'undefined') return value;
    return (typeof value === 'undefined' || value === null) ? defaultValue : value;
  };

  const replaceArray = (arr) => {

    return arr.map(elPath => {
      // d.arr[3][3][2] -> d.arr[3].3.2
      const isMatch = elPath.match(/^\[\d*\]$/gm);
      if (!isMatch) return elPath;

      elPath = elPath.replace(/]/g, '');
      elPath = elPath.replace(/\[/g, '');

      return elPath;

    });

  };

  let pathArr = path.replace(/]\[/g, '].[');

  pathArr = pathArr.split(".");
  pathArr = replaceArray(pathArr);

  let pathObj = obj;

  for (let pathEl of pathArr) {

    try {

      let start = (pathEl.indexOf("["));
      let end = (pathEl.indexOf("]"));

      if (start > -1 && end > -1) {

        let subPathEl = pathEl.replace(/]/g, '');
        subPathEl = subPathEl.split("[");
        if (subPathEl.length > 2) subPathEl.shift();
        subPathEl = subPathEl.join('.');
        subPathEl = subPathEl.replace(/]/g, '');
        pathObj = pathExists(pathObj, subPathEl);

      } else {

        pathObj = pathObj[pathEl];

      }

    } catch (e) {
      return returnValue();
    }
  }

  return returnValue(pathObj);

};
