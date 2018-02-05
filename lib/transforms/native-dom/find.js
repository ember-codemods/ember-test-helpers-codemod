const { createQuerySelectorExpression, createQuerySelectorAllExpression } = require('../../utils');

/**
 * Transform find/findAll to this.element.querySelector/-All
 *
 * @param file
 * @param api
 * @returns {*|string}
 */
function transform(file, api) {
  let source = file.source;
  let j = api.jscodeshift;
  let root = j(source);

  let nativeDomImportStatement = root.find(j.ImportDeclaration, {
    source: { value: 'ember-native-dom-helpers' }
  });
  if (nativeDomImportStatement.length === 0) {
    return root.toSource({ quote: 'single' });
  }

  let oldSpecifiers = nativeDomImportStatement.get('specifiers');
  let newSpecifiers = [];
  oldSpecifiers.each(({ node: specifier }) => {
    let importedName = specifier.imported.name;
    switch (importedName) {
      case 'find':
        root
          .find(j.CallExpression, {
            callee: {
              name: 'find'
            }
          })
          .replaceWith(({ node }) => createQuerySelectorExpression(j, node.arguments));
        break;
      case 'findAll':
        root
          .find(j.CallExpression, {
            callee: {
              name: 'findAll'
            }
          })
          .replaceWith(({ node }) => createQuerySelectorAllExpression(j, node.arguments));
        break;
      default:
        newSpecifiers.push(specifier);
    }
  });
  oldSpecifiers.replace(newSpecifiers);

  return root.toSource({ quote: 'single' });
}

module.exports = transform;
