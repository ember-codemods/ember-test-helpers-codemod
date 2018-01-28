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

  // Multiple jQuery selectors
  const firstChecked = find(find('.foo input:checked'));
  const secondChecked = find(findAll('.foo input:checked')[2]);
  const firstCheckedText = find('.foo input:checked').textContent;
  const secondCheckedText = find(findAll('.foo input:checked')[2]).textContent;

  // False positives
  const className = find('.selected');
});
