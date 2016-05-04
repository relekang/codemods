module.exports = function transformer(file, api, options = {}) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.CallExpression, { callee: { name: 'microComponentCreator' } })
    .replaceWith(n => {
      console.log(n);
      return n;
    })
    .toSource(options);
};
