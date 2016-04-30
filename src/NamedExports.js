const replacers = {
  Literal(j, node) {
    return j.exportNamedDeclaration(
      j.variableDeclaration('const', [
        j.variableDeclarator(
          j.identifier(node.key.name),
          j.literal(node.value.value)
        ),
      ])
    );
  },

  FunctionExpression(j, node) {
    return j.exportNamedDeclaration(
      j.functionDeclaration(
        j.identifier(node.key.name),
        node.value.params,
        node.value.body
      )
    );
  },

  ArrowFunctionExpression(j, node) {
    return j.exportNamedDeclaration(
      j.variableDeclaration('const', [
        j.variableDeclarator(
          j.identifier(node.key.name),
          j.arrowFunctionExpression(node.value.params, node.value.body)
        ),
      ])
    );
  },
};

module.exports = function transformer(file, api, options = {}) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.ExportDefaultDeclaration)
    .replaceWith(n =>
      n.value.declaration.properties
        .map(p => replacers[p.value.type](j, p))
    )
    .toSource(options);
};
