import { find, findAll } from 'ember-native-dom-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});


test(':selected is replaced correctly', function(assert) {
  // find
  const checkedVal = find('.foo input:checked').value;
  assert.equal(checkedVal, 13);

  // findAll
  const checkedCount = findAll('select option:checked').length;
  assert.equal(checkedCount, 3);

  // Multiple jQuery selectors
  const firstChecked = find('.foo input:checked').value;
  const secondChecked = find(findAll('.foo input:checked')[2]).value;
});
