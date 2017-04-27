const { makeParentFunctionAsync, createTriggerExpression, isJQuerySelectExpression, addImportStatement } = require('../utils');

function isJQueryExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'trigger'
    && node.arguments.length === 1;
}

function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;

  let root = j(source);

  let replacements = root
    .find(j.CallExpression)
    .filter(({ node }) => isJQueryExpression(j, node))
    .replaceWith(({ node }) => createTriggerExpression(j, node.callee.object.arguments[0], node.arguments[0]))
    .forEach((path) => makeParentFunctionAsync(j, path))
    ;

  if (replacements.length > 0) {
    addImportStatement(j, root, ['triggerEvent']);
  }

  return root.toSource({ quote: 'single' });
}

module.exports = transform;