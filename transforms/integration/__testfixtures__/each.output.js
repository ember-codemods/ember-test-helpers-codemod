import { findAll } from '@ember/test-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

test('anonymous function callback with two args', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = findAll('.button-class').forEach((val, i) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('anonymous function callback with one arg', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = findAll('.button-class').forEach((element, index) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with two args', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = findAll('.button-class').forEach(function(element, index) {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with one arg', function(assert) {
  this.render(hbs`{{foo-bar}}`);

  const elemIds = findAll('.button-class').forEach((element, index) => {
    assert.equal(element.id, `button${index}`);
  });
});
