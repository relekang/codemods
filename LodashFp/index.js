module.exports = function transformer(file, api) {
  const j = api.jscodeshift;


  function replace(path) {
    const callee = path.value.callee;
    const args = path.value.arguments;
    let newExpression;

    switch (callee.property.name) {
      case 'map':
      case 'omit':
      case 'filter':
        if (args.length > 1) {
          newExpression = j.callExpression(
            j.callExpression(callee, args.slice(1)), args.slice(0, 1)
          );
        } else {
          newExpression = path;
        }
        break;

      case 'isUndefined':
      case 'isEmpty':
      case 'isBoolean':
      case 'isFunction':
      case 'isObject':
      case 'isNil':
      case 'isString':
      case 'get':
        newExpression = path;
        break;

      default:
        console.log(callee.property.name); // eslint-disable-line
        throw new Error(`Unknown callee ${callee.property.name}`);
    }

    j(path).replaceWith(newExpression);
  }

  return j(file.source)
    .find(j.CallExpression, { callee: { object: { name: '_' } } })
    .forEach(path => replace(path))
    .toSource();
};
