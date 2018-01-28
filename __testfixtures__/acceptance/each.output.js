import { findAll } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('anonymous function callback with two args', function(assert) {
  const elemIds = findAll('.button-class').forEach((element, index) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('anonymous function callback with one arg', function(assert) {
  const elemIds = findAll('.button-class').forEach((element, index) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with two args', function(assert) {
  const elemIds = findAll('.button-class').forEach(function(elem, i) {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with one arg', function(assert) {
  const elemIds = findAll('.button-class').forEach((element, index) => {
    assert.equal(element.id, `button${index}`);
  });
});
