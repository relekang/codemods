module.exports = function transformer(file, api, options = {}) {
  const j = api.jscodeshift;

  const root = j(file.source);
  const parts = [];
  let hasChain = false;

  root
    .find(j.Identifier, { name: '_' })
    .filter(p => p.parentPath.value.type === 'CallExpression')
    .map(p => {
      hasChain = true;
      return p;
    });

  root
    .find(j.Identifier, { name: '_' })
    .filter(p => p.parentPath.value.type === 'MemberExpression')
    .map(p => {
      parts.push(p.parentPath.value.property.name);
      return p.parentPath.parentPath;
    })
    .replaceWith(p =>
      j.callExpression(j.identifier(p.value.callee.property.name), p.value.arguments)
    );

  root
    .find(j.ImportDefaultSpecifier, { local: { name: '_' } })
    .replaceWith(p => {
      const specifiers = [];
      if (hasChain) specifiers.push(p.value);
      parts.forEach(part => specifiers.push(j.importSpecifier(j.identifier(part))));
      return specifiers;
    });

  return root.toSource(options);
};
