import { fillIn, currentURL, visit } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('fillIn');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  await fillIn('#bar', 'baz');
  await fillIn(this.element.querySelectorAll('#qux input')[5], 'qaaz');
  assert.equal(currentURL(), '/foo');
});
