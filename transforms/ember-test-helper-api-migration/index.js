const { getParser } = require('codemod-cli').jscodeshift;
const { addImportStatement, writeImportStatements } = require('../utils');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);

  /**
   * Transform imports from ember-test-helpers to @ember/test-helpers
   */
  function transform() {
    let deprecatedEmberTestHelperStatements = root.find(j.ImportDeclaration, {
      source: { value: 'ember-test-helpers'}
    })

    if (deprecatedEmberTestHelperStatements.length === 0) {
      return root.toSource({
        quote: 'single',
        trailingComma: true,
      });
    }

    let newImports = [];

    deprecatedEmberTestHelperStatements.forEach((importStatement) => {
      let oldSpecifiers = importStatement.get('specifiers');
  
      oldSpecifiers.each(({ node: specifier }) => {
        let importedName = specifier.imported.name;
        newImports.push(importedName)
      });

      // Remove "ember-test-helper" import statement
      j(importStatement).remove();
    });
  
    addImportStatement(newImports);
    writeImportStatements(j, root);
  }

  transform();

  return root.toSource({
    quote: 'single',
    trailingComma: true,
  });
}
