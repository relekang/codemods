module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  function getIfsWithAttribute(attribute) {
    return root
      .find(j.JSXIdentifier, { name: 'If' })
      .map(p => p.parentPath.parentPath)
      .filter(n =>
         j(n.value).find(j.JSXIdentifier, { name: attribute }).size() === 1 ||
         j(n.value.openingElement).find(j.JSXIdentifier, { name: attribute }).size() === 1
      );
  }

  const shouldRemoveImport = getIfsWithAttribute('soft').size() === 0;

  function createLogicalExpression(p) {
    let child = p.value.children.filter(n => n.type !== 'Literal')[0];
    if (p.value.children.filter(n => n.type !== 'Literal').length > 1) {
      child = j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier('span')),
        j.jsxClosingElement(j.jsxIdentifier('span')),
        p.value.children
      );
    }

    if (child.type === 'JSXExpressionContainer') {
      child = child.expression;
    }

    return j.jsxExpressionContainer(
      j.logicalExpression(
        '&&',
        p.value.openingElement.attributes[0].value.expression,
        child
      )
    );
  }


  if (getIfsWithAttribute('condition').size()) {
    getIfsWithAttribute('condition')
      .filter(n => !!n.value.parenthesizedExpression)
      .replaceWith(p => {
        const open = j.jsxOpeningElement(j.jsxIdentifier('span'));
        const close = j.jsxClosingElement(j.jsxIdentifier('span'));
        return j.jsxElement(open, close, [createLogicalExpression(p)]);
      });


    getIfsWithAttribute('condition')
      .filter(n => !n.value.parenthesizedExpression)
      .replaceWith(p => createLogicalExpression(p));

    if (shouldRemoveImport) {
      root
        .find(j.ImportDefaultSpecifier, { local: { name: 'If' } })
        .map(n => n.parentPath.parentPath)
        .remove();
    }
  }

  return root.toSource();
};
