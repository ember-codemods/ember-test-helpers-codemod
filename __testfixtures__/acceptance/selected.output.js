import { find, findAll } from '@ember/test-helpers';
import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('selected');

test(':selected is replaced correctly', function(assert) {
  // find
  const checkedVal = find('.foo input:checked').value;
  assert.equal(checkedVal, 13);

  // findAll
  const checkedCount = findAll('select option:checked').length;
  assert.equal(checkedCount, 3);
});
