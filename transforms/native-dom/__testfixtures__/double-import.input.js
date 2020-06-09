import { click, currentURL } from 'ember-native-dom-helpers';
import { find, visit } from 'ember-native-dom-helpers';

test('visiting /foo', async function(assert) {
  await visit('/foo');
  await click('.foo');
  assert.ok(find('.foo'));
  assert.ok(currentURL());
});
