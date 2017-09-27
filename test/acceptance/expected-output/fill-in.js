import { fillIn, currentURL, findAll, visit } from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('fillIn');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  await fillIn('#bar', 'baz');
  await fillIn(findAll('#qux input')[5], 'qaaz');
  assert.equal(currentURL(), '/foo');
});
