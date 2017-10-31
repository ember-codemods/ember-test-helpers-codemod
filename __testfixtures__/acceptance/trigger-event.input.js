import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('triggerEvent');

test('visiting /foo', function(assert) {
  visit('/foo');

  triggerEvent('input', 'focus');
  triggerEvent('input', 'blur');
  triggerEvent('#bar', 'mouseenter');
  andThen(function() {
    assert.equal(currentURL(), '/foo');
  });
});