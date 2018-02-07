const { createFindExpression, createPropExpression, isFindExpression, addImportStatement, writeImportStatements } = require('../../utils');

/**
 * Creates a `find(selector).getAttribute(attr)` expression
 *
 * @param j
 * @param findArgs
 * @param attr
 * @returns {*}
 */
function createAttributeExpression(j, findArgs, attr) {
  return j.callExpression(
    j.memberExpression(
      createFindExpression(j, findArgs),
      j.identifier('getAttribute')
    ), [attr]
  );
}

/**
 * Check if `node` is a `this.$(selector).attr('foo')` expression
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
    && node.callee.property.name === 'attr'
    && node.arguments.length === 1;
}
/**
 * Should we translate this to a `.getAttribute('foo')` or a `.foo` expression?
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isPropertyAccessPreferred(j, node) {
  let arg = node.arguments[0];
  return j.Literal.check(arg) && arg.value === 'id';
}

/**
 * Transform `this.$(selector).attr('foo')` to `find(selector).getAttribute(attr)`
 *
 * @param file
 * @param api
 * @returns {*|string}
 */
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
    addImportStatement(['find']);
  }

  writeImportStatements(j, root);
  return root.toSource({ quote: 'single' });
}

module.exports = transform;
