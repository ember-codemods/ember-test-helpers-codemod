const { migrateSelector, makeParentFunctionAsync, isJQuerySelectExpression, addImportStatement } = require('../utils');

function isJQueryExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'trigger'
    && node.arguments.length === 2
    && j.ObjectExpression.check(node.arguments[1])
    && node.arguments[1]
    && j.Identifier.check(node.arguments[1].properties[0].key)
    && node.arguments[1].properties[0].key.name === 'keyCode'
    ;
}

function createExpression(j, selector, eventName, keyCode) {
  return j.awaitExpression(
    j.callExpression(
      j.identifier('keyEvent'),
      [migrateSelector(j, selector), eventName, keyCode]
    )
  );
}

function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;

  let root = j(source);

  let replacements = root
    .find(j.CallExpression)
    .filter(({ node }) => isJQueryExpression(j, node))
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments[0], node.arguments[0], node.arguments[1].properties[0].value))
    .forEach((path) => makeParentFunctionAsync(j, path))
    ;

  if (replacements.length > 0) {
    addImportStatement(j, root, ['keyEvent']);
  }

  return root.toSource({ quote: 'single' });
}

module.exports = transform;