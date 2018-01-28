import { currentURL, visit } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');
  assert.equal(currentURL(), '/foo');
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentURL(), '/bar');
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentURL(), '/bar');
});
