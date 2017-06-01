import { blur, focus, triggerEvent, visit } from 'ember-native-dom-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('triggerEvent');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  await focus('input');
  await blur('input');
  await triggerEvent('#bar', 'mouseenter');
  assert.equal(currentURL(), '/foo');
});