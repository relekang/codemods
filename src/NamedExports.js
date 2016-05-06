function replace(type, j, node) {
  switch (type) {
    case 'Literal':
      return j.exportNamedDeclaration(
        j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier(node.key.name),
            j.literal(node.value.value)
          ),
        ])
      );

    case 'FunctionExpression':
      return j.exportNamedDeclaration(
        j.functionDeclaration(
          j.identifier(node.key.name),
          node.value.params,
          node.value.body
        )
      );

    case 'ArrowFunctionExpression':
      return j.exportNamedDeclaration(
        j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier(node.key.name),
            j.arrowFunctionExpression(node.value.params, node.value.body)
          ),
        ])
      );

    case 'CallExpression':
      return j.exportNamedDeclaration(
        j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier(node.key.name),
            node.value
          ),
        ])
      );

    default:
      throw new Error(`Missing replacer for ${type}`);
  }
}

module.exports = function transformer(file, api, options = {}) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.ExportDefaultDeclaration)
    .filter(n => n.value.declaration.type === 'ObjectExpression')
    .replaceWith(n =>
      n.value.declaration.properties
        .map(p => replace(p.value.type, j, p))
    )
    .toSource(options);
};
