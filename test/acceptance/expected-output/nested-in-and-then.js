import { click } from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('find');

test('visiting /twiddles', async function(assert) {
  await click('.foo');
});