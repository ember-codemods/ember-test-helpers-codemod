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

  // Multiple jQuery selectors
  const firstChecked = find('.foo input:selected:eq(0)');
  const secondChecked = find('.foo input:selected:eq(2)');
  const firstCheckedText = find(find('.foo input:checked')).text();
  const secondCheckedText = find(findAll('.foo input:checked')[2]).text();

  // False positives
  const className = find('.selected');
});
