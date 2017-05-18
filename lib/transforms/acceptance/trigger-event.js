const { createFocusExpression, createBlurExpression, makeAwait, dropAndThen, addImportStatement } = require('../../utils');

/**
 * Check if `node` is a `triggerEvent(...)` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isGlobalHelperExpression(j, node) {
  return j.CallExpression.check(node)
    && j.Identifier.check(node.callee)
    && node.callee.name === 'triggerEvent'
    && node.arguments.length >= 2
    && j.Literal.check(node.arguments[1]);
}

/**
 * Transform `triggerEvent(...)` to `await triggerEvent(...)`, remove `andThen` calls
 * Special support for `blur` and `focus`
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
      .filter(({ node }) => isGlobalHelperExpression(j, node))
    ;

  let triggerReplacements = replacements
    .filter(({ node }) => node.arguments[1].value !== 'focus' && node.arguments[1].value !== 'blur');

  let focusReplacements = replacements
    .filter(({ node }) => node.arguments[1].value === 'focus');

  let blurReplacements = replacements
    .filter(({ node }) => node.arguments[1].value === 'blur');

  if (blurReplacements.length > 0) {
    blurReplacements
      .replaceWith(({ node }) => createBlurExpression(j, node.arguments[0]));
    addImportStatement(j, root, ['blur']);
  }

  if (focusReplacements.length > 0) {
    focusReplacements
      .replaceWith(({ node }) => createFocusExpression(j, node.arguments[0]));
    addImportStatement(j, root, ['focus']);
  }

  if (triggerReplacements.length > 0) {
    makeAwait(j, triggerReplacements);
    addImportStatement(j, root, ['triggerEvent']);
  }

  if (replacements.length > 0) {
    dropAndThen(j, root);
  }

  return root.toSource({ quote: 'single' });
}

module.exports = transform;