const { createFindExpression, isFindExpression, addImportStatement } = require('../../utils');

/**
 * Creates a `find(selector).classList.contains(className)` expression
 *
 * @param j
 * @param findArgs
 * @param className
 * @returns {*}
 */
function createExpression(j, findArgs, className) {
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

/**
 * Check if `node` is a `this.$(selector).hasClass(className)` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isJQueryExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && isFindExpression(j, node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === 'hasClass';
}

/**
 * Transform `this.$(selector).hasClass(className)` to `find(selector)classList.contains(className)`
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
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments, node.arguments[0]));

  if (replacements.length > 0) {
    addImportStatement(j, root, ['find']);
  }

  return root.toSource({ quote: 'single' });
}

module.exports = transform;