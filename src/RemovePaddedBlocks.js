module.exports = function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.BlockStatement)
    .map(n => n.parentPath)
    .filter(n => {
      const { loc, body } = n.value.body;
      if (loc.start.line < body[0].loc.end.line - 1) {
        return true;
      }

      if (loc.end.line > body[body.length - 1].loc.end.line + 1) {
        return true;
      }

      return false;
    })
    .replaceWith(n => j.blockStatement(n.value.body.body))
    .toSource();
};
