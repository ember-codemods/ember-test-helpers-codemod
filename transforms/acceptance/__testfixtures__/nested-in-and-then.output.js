import { click } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /twiddles', async function(assert) {
  await click('.foo');

  await click('.foo');

  await click('.foo');

  assert.ok(true);

  assert.ok(true);
});

test('visiting /twiddles', async function(assert) {
  await click('.foo');
});
