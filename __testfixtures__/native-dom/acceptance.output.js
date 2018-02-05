import { currentURL, currentRouteName, visit } from '@ember/test-helpers';
import { currentPath } from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');
  assert.equal(currentURL(), '/foo');
  assert.ok(this.element.querySelector('.foo'));
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentPath(), 'bar');
});

test('visiting /bar', async function(assert) {
  await visit('/bar');
  assert.equal(currentRouteName(), 'bar.index');
});
