import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('anonymous function callback with two args', function(assert) {
  const elemIds = find('.button-class').find((index, element) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('anonymous function callback with one arg', function(assert) {
  const elemIds = find('.button-class').find((index) => {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with two args', function(assert) {
  const elemIds = find('.button-class').find(function(i, elem) {
    assert.equal(element.id, `button${index}`);
  });
});

test('function callback with one arg', function(assert) {
  const elemIds = find('.button-class').find((index) => {
    assert.equal(element.id, `button${index}`);
  });
});
