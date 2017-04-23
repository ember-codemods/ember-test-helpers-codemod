const { makeParentFunctionAsync, isJQuerySelectExpression, addImportStatement } = require('../utils');

function createClickExpression(j, selector) {
  return j.awaitExpression(
    j.callExpression(
      j.identifier('click'),
      selector
    )
  );
}

function isJQueryClickExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'click';
}

function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;

  let root = j(source);

  let replacements = root
    .find(j.CallExpression)
    .filter(({ node }) => isJQueryClickExpression(j, node))
    .replaceWith(({ node }) => createClickExpression(j, node.callee.object.arguments))
    .forEach((path) => makeParentFunctionAsync(j, path))
    ;

  if (replacements.length > 0) {
    addImportStatement(j, root, ['click']);
  }

  return root.toSource({ quote: 'single' });
}

module.exports = transform;