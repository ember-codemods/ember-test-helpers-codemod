import { click, currentURL, visit } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  await click('#bar');
  await click(this.element.querySelectorAll('.baz a')[12]);
  assert.equal(currentURL(), '/foo');
});
