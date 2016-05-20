module.exports = function transformer(file, api, options = {}) {
  const j = api.jscodeshift;

  const root = j(file.source);

  root
    .find(j.ImportDefaultSpecifier, { local: { name: 'microComponentCreator' } })
    .map(n => n.parentPath.parentPath)
    .remove();

  root
    .find(j.CallExpression, { callee: { name: 'microComponentCreator' } })
    .replaceWith(n => n.value.arguments[1]);

  return root.toSource(options);
};
