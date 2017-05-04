const { createFindExpression, createPropExpression, isJQuerySelectExpression, addImportStatement } = require('../utils');

function createAttributeExpression(j, findArgs, attr) {
  return j.callExpression(
    j.memberExpression(
      createFindExpression(j, findArgs),
      j.identifier('getAttribute')
    ), [attr]
  );
}

function isJQueryExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'attr'
    && node.arguments.length === 1;
}

function isPropertyAccessPreferred(j, node) {
  let arg = node.arguments[0];
  return j.Literal.check(arg) && arg.value === 'id';
}

function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;

  let root = j(source);

  let propReplacements = root
    .find(j.CallExpression)
    .filter(({ node }) => isJQueryExpression(j, node))
    .filter(({ node }) => isPropertyAccessPreferred(j, node))
    .replaceWith(({ node }) => createPropExpression(j, node.callee.object.arguments, node.arguments[0].value));

  let attrReplacements = root
    .find(j.CallExpression)
    .filter(({ node }) => isJQueryExpression(j, node))
    .filter(({ node }) => !isPropertyAccessPreferred(j, node))
    .replaceWith(({ node }) => createAttributeExpression(j, node.callee.object.arguments, node.arguments[0]));

  if (propReplacements.length > 0 || attrReplacements.length > 0) {
    addImportStatement(j, root, ['find']);
  }

  return root.toSource({ quote: 'single' });
}

module.exports = transform;