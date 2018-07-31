import { visit } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');
  assert.ok(true);
});

test('visiting /foo', async function(assert) {
  await visit('/foo');
});

test('visiting /foo', async function(assert) {
  await visit('/foo');
  assert.ok(true);
});
