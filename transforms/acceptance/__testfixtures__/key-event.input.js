import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('keyEvent');

test('visiting /foo', function(assert) {
  visit('/foo');

  keyEvent('#bar', 'keypress', 13);
  andThen(function() {
    assert.equal(currentURL(), '/foo');
  });
});