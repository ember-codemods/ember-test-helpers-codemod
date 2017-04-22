const { createFindExpression, isJQuerySelectExpression, addImportStatement } = require('../utils');

function createClassListExpression(j, findArgs, className) {
  return j.callExpression(
    j.memberExpression(
      j.memberExpression(
        createFindExpression(j, findArgs),
        j.identifier('classList')
      ),
      j.identifier('contains')
    ),
    [className]
  );
}

function isJQueryHasClassExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'hasClass';
}

function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;

  let root = j(source);

  let replacements = root
    .find(j.CallExpression)
    .filter(({ node }) => isJQueryHasClassExpression(j, node))
    .replaceWith(({ node }) => createClassListExpression(j, node.callee.object.arguments, node.arguments[0]));

  if (replacements.length > 0) {
    addImportStatement(j, root, ['find']);
  }

  return root.toSource({ quote: 'single' });
}

module.exports = transform;