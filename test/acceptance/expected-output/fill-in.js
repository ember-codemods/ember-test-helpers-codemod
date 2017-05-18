import { fillIn, visit } from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('fillIn');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  await fillIn('#bar', 'baz');
  assert.equal(currentURL(), '/foo');
});