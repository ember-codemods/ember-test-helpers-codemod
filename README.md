# ember-native-dom-helpers-codemod

A [jscodeshift]() based codemod to help migrating your jQuery based Ember tests to [ember-native-dom-helpers](https://github.com/cibernox/ember-native-dom-helpers).

*Please note that this will not be able to cover all possible cases how jQuery based tests can be written. 
Given the dynamic nature of JavaScript and the extensive API and fluent interface of jQuery, this would be impossible.
Instead this codemod focuses to cover the most common usages and do those transformations that it can safely do. 
So it is likely that you will have to manually migrate some usages this tool cannot cover!*  

## Usage

*todo*


## Transformations

### Integrations tests

This addon will perform the following transformations:

| Before | After | Transform |
| `this.$('.foo').attr('id')` | `find('.foo').getAttribute('id')` | `attr.js |
| `this.$('.foo').click()` | `await click('.foo')` | `click.js` |
| `this.$('.foo').change()` | `await triggerEvent('.foo', 'change')` | `event.js` |
| `this.$('.foo').trigger('input')` | `await triggerEvent('.foo', 'input')` | `event.js` |
| `this.$('.foo').focus()` | `await focus('.foo')` | `focus.js` |
| `this.$('.foo').val()` | `find('.foo').value` | `get-value.js` |
| `this.$('div').hasClass('foo')` | `find('div').classList.contains('foo')` | `has-class.js` |
| `this.$('.foo').length` | `findAll('.foo').length` | `length.js` |
| `this.$('.foo').val('foo')` | `await fillIn('.foo', 'foo')` | `set-value.js` |
| `this.$('.foo').val('bar').change()` | `await fillIn('.foo', 'foo'); await triggerEvent('.foo', 'change');` | `set-value.js` |
| `this.$('.foo').val('bar').trigger('input')` | `await fillIn('.foo', 'foo'); await triggerEvent('.foo', 'input');` | `set-value.js` |
| `this.$('.foo').text()`       | `find('.foo').textContent`       | `text.js`          |

### Acceptance tests

*The codemod does not cover acceptance tests currently*