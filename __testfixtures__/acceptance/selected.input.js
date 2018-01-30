import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('selected');

test(':selected is replaced correctly', function(assert) {
  // find
  const checkedVal = find('.foo input:selected').val();
  assert.equal(checkedVal, 13);

  // findAll
  const checkedCount = find('select option:selected').length;
  assert.equal(checkedCount, 3);
});
