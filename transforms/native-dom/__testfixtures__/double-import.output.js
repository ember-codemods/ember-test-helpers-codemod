import { click, currentURL, find, visit } from '@ember/test-helpers';

test('visiting /foo', async function(assert) {
  await visit('/foo');
  await click('.foo');
  assert.ok(find('.foo'));
  assert.ok(currentURL());
});
