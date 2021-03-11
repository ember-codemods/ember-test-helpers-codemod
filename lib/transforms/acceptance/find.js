const {
  createFindAllExpression,
  isFindExpression,
  addImportStatement,
  writeImportStatements,
  transformEachsCallbackArgs
} = require('../../utils');

/**
 * Creates a `findAll(selector).find()` expression
 *
 * @param j
 * @param findArgs
 * @param eachCallback
 * @returns {*}
 */
function createExpression(j, findArgs, eachCallback) {
  const transformedCallback = transformEachsCallbackArgs(eachCallback);
  return j.callExpression(
    j.memberExpression(
      createFindAllExpression(j, findArgs),
      j.identifier('find')
    ), transformedCallback
  );
}

/**
 * Check if `node` is a `find(selector).find()` expression
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
    && node.callee.property.name === 'find'
}

/**
 * Transform `find(selector).find()` to `findAll(selector).find()`
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
    .replaceWith(({ node }) => createExpression(j, node.callee.object.arguments, node.arguments));

  if (replacements.length > 0) {
    addImportStatement(['findAll']);
  }

  writeImportStatements(j, root);
  return root.toSource({ quote: 'single' });
}

module.exports = transform;
