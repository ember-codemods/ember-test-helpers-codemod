import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', function(assert) {
  visit('/foo');
  andThen(function() {
  });

  andThen(function() {
    assert.ok(true);
  });
});

test('visiting /foo', function(assert) {
  visit('/foo');
  return andThen(function() {
  });
});

test('visiting /foo', function(assert) {
  visit('/foo');
  return andThen(function() {
    assert.ok(true);
  });
});
