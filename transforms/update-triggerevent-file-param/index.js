const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);

  /**
   * A transform to update param in `triggerEvent` from `[ file ]` to `{ files: [ file ] }`
   */
  function transform() {
    root
      .find(j.CallExpression, {
        callee: {
          name: 'triggerEvent',
        },
      })
      .find(j.ArrayExpression)
      .replaceWith((path) => {
        // make sure we just modify the arrayExpression which is the param of triggerEvent call expression
        if (
          path.parent.node.type === 'CallExpression' &&
          path.parent.node.callee.name === 'triggerEvent'
        ) {
          return j.objectExpression([j.property('init', j.identifier('files'), path.node)]);
        } else return path.node;
      });
  }

  transform();

  return root.toSource({
    quote: 'single',
    trailingComma: false,
  });
};
