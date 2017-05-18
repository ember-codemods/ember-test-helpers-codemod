import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('fillIn');

test('visiting /foo', function(assert) {
  visit('/foo');

  fillIn('#bar', 'baz');
  andThen(function() {
    assert.equal(currentURL(), '/foo');
  });
});