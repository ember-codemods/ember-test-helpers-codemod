const jqExtensions = [
  /:eq\(/,
  /:even/,
  /:odd/,
  /:contains\(/,
  /:has\(/,
  /:animated/,
  /:checkbox/,
  /:file/,
  /:first(?!-child)/,
  /:gt\(/,
  /:header/,
  /:hidden/,
  /:image/,
  /:input/,
  /:last(?!-child)/,
  /:lt\(/,
  /:parent/,
  /:password/,
  /:radio/,
  /:reset/,
  /:selected/,
  /:submit/,
  /:text/,
  /:visible/
];

/**
 * Check of the CSS selector string contains some jQuery specific parts
 *
 * @param {string} string
 * @returns {boolean}
 */
function containsJQuerySelectorExtension(string) {
  return jqExtensions.some((regex) => string.match(regex));
}

/**
 * Check if given node is a `this.$(selector)` expression.
 *
 * Will return false if tha selector is a string literal and contains jQuery specific (not standards compliant) selectors
 * that cannot be transformed
 *
 * @param j     jscodeshift API
 * @param node  AST node
 * @returns {boolean}
 */
function isJQuerySelectExpression(j, node) {
  return j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && j.ThisExpression.check(node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === '$'
    && (node.arguments.length === 0
      || !j.Literal.check(node.arguments[0])
      || (
        j.Literal.check(node.arguments[0])
        && typeof node.arguments[0].value === 'string'
        && !containsJQuerySelectorExtension(node.arguments[0].value)
      )
    )
    ;
}

/**
 * Check if `node` is a `find(selector)` expression
 *
 * @param j
 * @param node
 * @returns {*|boolean}
 */
function isFindExpression(j, node) {
  return j.CallExpression.check(node)
    && j.Identifier.check(node.callee)
    && node.callee.name === 'find';
}

/**
 * Transform jQuery specific selectors to a standards-compliant version
 *
 * @param j         jscodeshift API
 * @param selector
 * @returns {*}
 */
function migrateSelector(j, selector) {
  if (j.Literal.check(selector) && typeof selector.value === 'string') {
    let string = selector.value;
    // @todo selector migrations could be added here
    selector.value = string;
  }
  return selector;
}

/**
 * Create a `find(selector)` expression
 *
 * @param j     jscodeshift API
 * @param args  function arguments
 * @returns {*}
 */
function createFindExpression(j, args) {
  args = args.length > 0 ? args.map(s => migrateSelector(j, s)) : [j.literal('*')];
  return j.callExpression(j.identifier('find'), args);
}

/**
 * Create a `findAll(selector)` expression
 *
 * @param j     jscodeshift API
 * @param args  function arguments
 * @returns {*}
 */
function createFindAllExpression(j, args) {
  args = args.length > 0 ? args.map(s => migrateSelector(j, s)) : [j.literal('*')];
  return j.callExpression(j.identifier('findAll'), args);
}

/**
 * Create a `triggerEvent(selector, eventName) expression
 *
 * @param j         jscodeshift API
 * @param selector  selector arguments
 * @param eventName
 * @returns {*}
 */
function createTriggerExpression(j, selector, eventName) {
  return j.awaitExpression(
    j.callExpression(
      j.identifier('triggerEvent'),
      [migrateSelector(j, selector), eventName]
    )
  );
}

/**
 * Create a `find(selector).prop` expression
 *
 * @param j         jscodeshift API
 * @param selector  selector arguments
 * @param prop      property
 * @returns {*}
 */
function createPropExpression(j, findArgs, prop) {
  return j.memberExpression(
    createFindExpression(j, findArgs),
    j.identifier(prop)
  );
}

/**
 * Create `await focus(selector)` expression
 * @param j
 * @param selector
 * @returns {*}
 */
function createFocusExpression(j, selector) {
  return j.awaitExpression(
    j.callExpression(
      j.identifier('focus'),
      [migrateSelector(j, selector)]
    )
  );
}

/**
 * Create `await focus(selector)` expression
 * @param j
 * @param selector
 * @returns {*}
 */
function createBlurExpression(j, selector) {
  return j.awaitExpression(
    j.callExpression(
      j.identifier('blur'),
     [migrateSelector(j, selector)]
    )
  );
}

/**
 * Adds (one or more) named imports to an (existing or to be created) `import { namedImport } from 'ember-native-dom-helpers';
 *
 * @param j
 * @param root
 * @param {array} imports
 */
function addImportStatement(j, root, imports) {
  let body = root.get().value.program.body;
  let importStatement = root.find(j.ImportDeclaration, {
    source: { value: 'ember-native-dom-helpers' }
  });

  if (importStatement.length === 0) {
    importStatement = createImportStatement(j, 'ember-native-dom-helpers', 'default', imports);
    body.unshift(importStatement);
  } else {
    let existingSpecifiers = importStatement.get("specifiers");

    imports.forEach(name => {
      if (existingSpecifiers.filter(exSp => exSp.value.imported.name === name).length === 0) {
        existingSpecifiers.push(j.importSpecifier(j.identifier(name)));
      }
    });
  }
}

/**
 * Create an ES6 module import statement
 *
 * @param j
 * @param source
 * @param imported
 * @param local
 * @returns {*}
 */
function createImportStatement(j, source, imported, local) {
  let declaration, variable, idIdentifier, nameIdentifier;

  // if no variable name, return `import 'jquery'`
  if (!local) {
    declaration = j.importDeclaration([], j.literal(source));
    return declaration;
  }

  // multiple variable names indicates a destructured import
  if (Array.isArray(local)) {
    let variableIds = local.map(function(v) {
      return j.importSpecifier(j.identifier(v), j.identifier(v));
    });

    declaration = j.importDeclaration(variableIds, j.literal(source));
  } else {
    // else returns `import $ from 'jquery'`
    nameIdentifier = j.identifier(local); //import var name
    variable = j.importDefaultSpecifier(nameIdentifier);

    // if propName, use destructuring `import {pluck} from 'underscore'`
    if (imported && imported !== "default") {
      idIdentifier = j.identifier(imported);
      variable = j.importSpecifier(idIdentifier, nameIdentifier); // if both are same, one is dropped...
    }

    declaration = j.importDeclaration([variable], j.literal(source));
  }

  return declaration;
}

/**
 * Find the first parent function that contains the given path object
 *
 * @param j     jscodeshift API
 * @param path  AST path
 * @returns {*}
 */
function findParentFunction(j, path) {
  while (path = path.parent) {
    if (j.FunctionExpression.check(path.node) || j.FunctionDeclaration.check(path.node) || j.ArrowFunctionExpression.check(path.node)) {
      return path;
    }
  }
}

/**
 * Finds the parent function that contains `path` and makes it `async`
 *
 * @param j     jscodeshift API
 * @param path  AST path
 */
function makeParentFunctionAsync(j, path) {
  let fn = findParentFunction(j, path);
  if (fn) {
    fn.node.async = true;
  }
}

/**
 * Remove calls to `andThen` and replace with inlined function body
 *
 *
 * @param j
 * @param root
 */
function dropAndThen(j, root) {
  root
    .find(j.CallExpression)
    .filter(({ node }) => {
      return j.Identifier.check(node.callee)
        && node.callee.name === 'andThen'
        && node.arguments.length === 1
        && j.FunctionExpression.check(node.arguments[0])
    })
    .map((path) => path.parent)
    .replaceWith(({ node }) => {
      return node.expression.arguments[0].body.body;
    });
}

function makeAwait(j, collection) {
  collection
    .replaceWith(({ node }) => j.awaitExpression(node))
    .forEach((path) => makeParentFunctionAsync(j, path));
}

module.exports = {
  isJQuerySelectExpression,
  isFindExpression,
  createFindExpression,
  createFindAllExpression,
  createTriggerExpression,
  createPropExpression,
  createFocusExpression,
  createBlurExpression,
  addImportStatement,
  createImportStatement,
  makeParentFunctionAsync,
  migrateSelector,
  dropAndThen,
  makeAwait
};
