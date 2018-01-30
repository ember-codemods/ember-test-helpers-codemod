import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('selected');

test(':selected is replaced correctly', function(assert) {
  // find
  const checkedVal = this.element.querySelector('.foo input:checked').value;
  assert.equal(checkedVal, 13);

  // findAll
  const checkedCount = this.element.querySelectorAll('select option:checked').length;
  assert.equal(checkedCount, 3);
});
