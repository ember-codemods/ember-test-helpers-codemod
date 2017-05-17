import { click } from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  visit('/foo');

  await click('#bar')
  assert.equal(currentURL(), '/foo');
});