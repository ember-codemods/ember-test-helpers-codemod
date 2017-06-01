const { createPropExpression, isJQuerySelectExpression, addImportStatement } = require('../../utils');

/**
 * Check if `node` is a `this.$(selector).prop('propName')` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isJQueryExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isJQuerySelectExpression(j, node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'prop'
    && node.arguments.length === 1
    && j.Literal.check(node.arguments[0]);
}

/**
 * Transforms `this.$(selector).prop('propName')` to `find(selector).propName`
 *
 * @param file
 * @param api
 * @returns {*|string}
 */
function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;

  let root = j(source);

  let replacements = root
      .find(j.CallExpression)
      .filter(({ node }) => isJQueryExpression(j, node))
      .replaceWith(({ node }) => createPropExpression(j, node.callee.object.arguments, node.arguments[0].value))
    ;

  if (replacements.length > 0) {
    addImportStatement(j, root, ['find']);
  }

  return root.toSource({ quote: 'single' });
}

module.exports = transform;