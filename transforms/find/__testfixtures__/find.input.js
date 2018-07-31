import { find, findAll } from '@ember/test-helpers';

test('it renders', function(assert) {
  assert.equal(find('.foo').textContent.trim(), 'bar');
  assert.equal(findAll('.bar').length, 2);
});