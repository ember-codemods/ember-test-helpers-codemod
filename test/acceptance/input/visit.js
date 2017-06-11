import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', function(assert) {
  visit('/foo');
  andThen(function() {
    assert.equal(currentURL(), '/foo');
  });
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentURL(), '/bar');
});