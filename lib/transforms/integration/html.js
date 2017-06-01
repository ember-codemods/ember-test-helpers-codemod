const { createFindExpression, isJQuerySelectExpression, addImportStatement } = require('../../utils');

/**
 * Creates a `find(selector).innerHTML` expression
 *
 * @param j
 * @param findArgs
 * @param attr
 * @returns {*}
 */
function createExpression(j, findArgs) {
  return j.memberExpression(
    createFindExpression(j, findArgs),
    j.identifier('innerHTML')
  );
}

/**
 * Check if `node` is a `this.$(selector).html()` expression
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
    && node.callee.property.name === 'html';
}

/**
 * Transform `this.$(selector).html()` to `find(selector).innerHTML`
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
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments));

  if (replacements.length > 0) {
    addImportStatement(j, root, ['find']);
  }

  return root.toSource({quote: 'single'});
}

module.exports = transform;