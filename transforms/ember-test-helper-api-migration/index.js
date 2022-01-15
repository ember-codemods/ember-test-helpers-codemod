const { createImportStatement } = require('../utils');
const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);

  let _statementsToImport = new Set();

  /**
   * Adds (one or more) named imports to a private import statement collection.
   * To write the import statements to a file, use writeImportStatements.
   *
   * @param j
   * @param {array} imports
   */
  function addImportStatement(imports) {
    imports.forEach((method) => _statementsToImport.add(method));
  }

  /**
   * Adds all collected named imports to an (existing or to be created) `import { namedImport } from '@ember/test-helpers';
   * To add named imports to the collection, use addImportStatement
   *
   * @param j
   * @param root
   */
  function writeImportStatements(j, root) {
    if (_statementsToImport.size > 0) {
      let body = root.get().value.program.body;
      let importStatement = root.find(j.ImportDeclaration, {
        source: { value: '@ember/test-helpers' },
      });

      let statementsToImportArray = Array.from(_statementsToImport)

      if (importStatement.length === 0) {
        importStatement = createImportStatement(
          j,
          '@ember/test-helpers',
          'default',
          statementsToImportArray
        );
        body.unshift(importStatement);
      } else {
        let existingSpecifiers = importStatement.get('specifiers');

        statementsToImportArray.forEach((name) => {
          if (existingSpecifiers.filter((exSp) => exSp.value.imported.name === name).length === 0) {
            existingSpecifiers.push(j.importSpecifier(j.identifier(name)));
          }
        });
      }
    }

    _statementsToImport = new Set();
  }

  /**
   * Transform imports from ember-test-helpers to @ember/test-helpers
   */
  function transform() {
    let deprecatedEmberTestHelperStatements = root.find(j.ImportDeclaration, {
      source: { value: 'ember-test-helpers' },
    });

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
        newImports.push(importedName);
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
};
