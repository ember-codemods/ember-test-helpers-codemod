import { find, visit } from 'ember-native-dom-helpers';
import { currentURL, currentPath, currentRouteName } from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');
  assert.equal(currentURL(), '/foo');
  assert.ok(find('.foo'));
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentPath(), 'bar');
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentRouteName(), 'bar.index');
});
