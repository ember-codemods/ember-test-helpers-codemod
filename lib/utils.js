const jqExtensions = [
  /:eq/,
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

const supportedJqExtensions = [
  /:eq/
];

// Collects all statements that need to be imported. Gets flushed when writeImportStatemtns is called.
let _statementsToImport = new Set();

/**
 * Check of the CSS selector string contains some jQuery specific parts
 *
 * @param {string} string
 * @param {boolean} excludeSupported
 * @returns {boolean}
 */
function containsJQuerySelectorExtension(string, excludeSupported = true) {
  return jqExtensions.some((regex) => string.match(regex))
    && (!excludeSupported || !supportedJqExtensions.some((regex) => string.match(regex)));
}

/**
 * Check if given node is a `this.$(selector)` expression.
 *
 * Will return false if that selector is a string literal or variable reference and contains jQuery specific
 * (not standards compliant) selectors that cannot be transformed
 *
 * @param j     jscodeshift API
 * @param node  AST node
 * @param path  NodePath
 * @returns {boolean}
 */
function isJQuerySelectExpression(j, node, path) {
  if (j.CallExpression.check(node)
    && j.MemberExpression.check(node.callee)
    && j.ThisExpression.check(node.callee.object)
    && j.Identifier.check(node.callee.property)
    && node.callee.property.name === '$') {

    let hasNoArgs = node.arguments.length === 0;
    let isLiteralSelector = j.Literal.check(node.arguments[0])
      && typeof node.arguments[0].value === 'string'
      && !containsJQuerySelectorExtension(node.arguments[0].value);

    if (hasNoArgs || isLiteralSelector) {
      return true;
    }

    if (j.Identifier.check(node.arguments[0])) {
      let name = node.arguments[0].name;
      let definingScope = path.scope.lookup(name);

      if (!definingScope) return false;
      let bindings = definingScope.getBindings()[name];
      if (!bindings) return false;

      let parent = bindings[0].parent;
      return j.VariableDeclarator.check(parent.node)
        && j.Literal.check(parent.node.init)
        && typeof parent.node.init.value === 'string'
        && !containsJQuerySelectorExtension(parent.node.init.value, false);
    }

  }
  return false;
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

    // When handling a special-case selector, return early.

    // Transform tail-eq selector to a find all
    if (/:eq\(\d+\)$/.test(string)) {
      let [, query, eqIndex ] = string.match(/(.+?):eq\((\d+)\)$/);
      selector.value = query;
      if (eqIndex === '0') {
        // findAll('*')[0] === find('*')
        return createFindExpression(j, [selector]);
      } else {
        addImportStatement(['findAll']);
        return createArraySubscriptExpression(j, createFindAllExpression(j, [ selector ]), +eqIndex);
      }
    }
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

  // Avoid nesting find calls
  let isFindCallExpression = args.length === 1
    && j.CallExpression.check(args[0])
    && j.Identifier.check(args[0].callee)
    && args[0].callee.name === 'find';

  if (isFindCallExpression) {
    return args[0];
  }

  return j.callExpression(j.identifier('find'), args);
}

/**
 * Create a `findAll(selector)` expression
 *
 * @param j     jscodeshift API
 * @param args  function arguments
 * @returns {*}
 */
function createFindAllExpression(j, args, fileRoot) {
  args = args.length > 0 ? args.map(s => migrateSelector(j, s, fileRoot)) : [j.literal('*')];

  // Avoid nesting findAll calls
  let isFindAllCallExpression = args.length === 1
    && j.CallExpression.check(args[0])
    && j.Identifier.check(args[0].callee)
    && args[0].callee.name === 'findAll';

  let isFindAllMemberExpression = args.length === 1
    && j.MemberExpression.check(args[0])
    && j.Identifier.check(args[0].object.callee)
    && args[0].object.callee.name === 'findAll';

  if (isFindAllCallExpression || isFindAllMemberExpression) {
    return args[0];
  }

  return j.callExpression(j.identifier('findAll'), args);
}

/**
 * Create `await click(selector)` expression
 * @param j
 * @param args
 * @returns {*}
 */
function createClickExpression(j, args) {
  args = args.map(s => migrateSelector(j, s));

  // Collapse inner find call
  let isFindCallExpression = args.length === 1
    && j.CallExpression.check(args[0])
    && j.Identifier.check(args[0].callee)
    && args[0].callee.name === 'find';

  if (isFindCallExpression) {
    args[0] = args[0].arguments[0];
  }

  return j.awaitExpression(
    j.callExpression(
      j.identifier('click'),
      args
    )
  );
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
  let triggerExpression = j.callExpression(
    j.identifier('triggerEvent'),
    [migrateSelector(j, selector), eventName]
  )
  return j.awaitExpression(triggerExpression);
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

function createArraySubscriptExpression(j, expression, index) {
  return j.memberExpression(expression, j.literal(index));
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
 * Adds (one or more) named imports to a private import statement collection.
 * To write the import statements to a file, use writeImportStatements.
 *
 * @param j
 * @param {array} imports
 */
function addImportStatement(imports) {
  imports.forEach(method => _statementsToImport.add(method));
}

/**
 * Adds all collected named imports to an (existing or to be created) `import { namedImport } from 'ember-native-dom-helpers';
 * To add named imports to the collection, use addImportStatement
 *
 * @param j
 * @param root
 */
function writeImportStatements(j, root) {
  if (_statementsToImport.size > 0) {
    let body = root.get().value.program.body;
    let importStatement = root.find(j.ImportDeclaration, {
      source: { value: 'ember-native-dom-helpers' }
    });

    if (importStatement.length === 0) {
      importStatement = createImportStatement(j, 'ember-native-dom-helpers', 'default', Array.from(_statementsToImport));
      body.unshift(importStatement);
    } else {
      let existingSpecifiers = importStatement.get("specifiers");

      _statementsToImport.forEach(name => {
        if (existingSpecifiers.filter(exSp => exSp.value.imported.name === name).length === 0) {
          existingSpecifiers.push(j.importSpecifier(j.identifier(name)));
        }
      });
    }
  }

  _statementsToImport = new Set();
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
    if (j.FunctionExpression.check(path.node) && !isAndThenCall(j, path) || j.FunctionDeclaration.check(path.node) || j.ArrowFunctionExpression.check(path.node)) {
      return path;
    }
  }
}

/**
 * Check if path is the function of a `andThen(function() {})`  expression
 * @param j
 * @param path
 * @returns {*|boolean}
 */
function isAndThenCall(j, path) {
  let parentNode = path.parent.node;
  return j.FunctionExpression.check(path.node)
    && j.CallExpression.check(parentNode)
    && j.Identifier.check(parentNode.callee)
    && parentNode.callee.name === 'andThen';
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
  let replacements = root
    .find(j.CallExpression, { callee: { name: 'andThen' } })
    .map((path) => path.parent)
    .replaceWith(({ node }) => {
      let body = node.expression.arguments[0].body;

      if (j.CallExpression.check(body)) {
        return j.expressionStatement(body);
      }

      return body.body;
    });

  if (replacements.length > 0) {
    dropAndThen(j, replacements);
  }
}

function makeAwait(j, collection) {
  collection
    .filter(({ parent: { node }}) => !j.AwaitExpression.check(node))
    .replaceWith(({ node }) => j.awaitExpression(node))
    .forEach((path) => {

      return makeParentFunctionAsync(j, path)
    });
}

/**
 * $.each's arguments are in the reverse order that Array.forEach's arguments are in.
 * Here we reverse the order of the args if there are tow, or add the current element to the front
 * of the arguments array if there is only one arg.
 * @param {*} callBack
 */
function transformEachsCallbackArgs(callBack) {
  let eachCallBackArgs = callBack[0].params;
  if (eachCallBackArgs.length === 1) {
    eachCallBackArgs.unshift('element');
  } else {
    eachCallBackArgs = eachCallBackArgs.reverse();
  }
  return callBack;
}

module.exports = {
  isJQuerySelectExpression,
  isFindExpression,
  createFindExpression,
  createFindAllExpression,
  createClickExpression,
  createTriggerExpression,
  createPropExpression,
  createArraySubscriptExpression,
  createFocusExpression,
  createBlurExpression,
  addImportStatement,
  writeImportStatements,
  createImportStatement,
  makeParentFunctionAsync,
  migrateSelector,
  dropAndThen,
  makeAwait,
  transformEachsCallbackArgs
};
