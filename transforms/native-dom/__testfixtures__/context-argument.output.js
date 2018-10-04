import { find, findAll, visit, click, fillIn } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('click');

test('visiting /foo', async function(assert) {
  await visit('/foo');

  const foo = find('.foo');
  assert.equal(foo.querySelector('.bar').textContent.trim(), 'bar');
  assert.equal(find('.foo').querySelector('.bar').textContent.trim(), 'bar');
  assert.equal(find('.foo .bar').textContent.trim(), 'bar');
  assert.equal(foo.querySelectorAll('.bar').length, 2);
  assert.equal(find('.foo').querySelectorAll('.bar').length, 2);
  assert.equal(findAll('.foo .bar').length, 2);

  await click(foo.querySelector('button'));
  await click('button', { shiftKey: true });
  await click(foo.querySelector('button'), { shiftKey: true });
});
