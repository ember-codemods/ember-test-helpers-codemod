import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', function(assert) {
  visit('/foo');

  click('#bar');
  andThen(function() {
    assert.equal(currentURL(), '/foo');
  });
});