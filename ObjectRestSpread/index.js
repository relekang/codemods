module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  function evaluateArgument(n) {
    switch (n.type) {
      case 'Identifier':
      case 'MemberExpression':
      case 'CallExpression':
        return j.spreadProperty(n);

      case 'ObjectExpression':
        return n.properties;

      case 'LogicalExpression':
        if (n.operator === '&&') {
          return j.spreadProperty(n.right);
        }
        throw new Error(`Unexpected type ${n.type}`);

      default:
        throw new Error(`Unexpected type ${n.type}`);
    }
  }

  const flatten = a => (Array.isArray(a) ? [].concat(...a.map(flatten)) : a);

  const update = path =>
    j(path)
          .replaceWith(
          j.objectExpression(
            flatten(path.value.arguments.map(evaluateArgument).filter(v => !!v))
          )
        );


  root
   .find(j.CallExpression, { callee: { property: { name: 'assign' } } })
   .forEach(update);

  root
   .find(j.CallExpression, { callee: { name: 'assign' } })
   .forEach(update);

  return root.toSource();
};
