const { createFindExpression, isJQuerySelectExpression, addImportStatement } = require('../utils');

function createExpression(j, findArgs) {
  return j.memberExpression(
    createFindExpression(j, findArgs),
    j.identifier('innerHTML')
  );
}

function isJQueryExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'html';
}

function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;

  let root = j(source);

  let replacements = root
    .find(j.CallExpression)
    .filter(({ node }) => isJQueryExpression(j, node))
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments));

  if (replacements.length > 0) {
    addImportStatement(j, root, ['find']);
  }

  return root.toSource({quote: 'single'});
}

module.exports = transform;