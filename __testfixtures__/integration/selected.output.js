import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});


test(':selected is replaced correctly', function(assert) {
  // find
  const checkedVal = this.element.querySelector('.foo input:checked').value;
  assert.equal(checkedVal, 13);

  // findAll
  const checkedCount = this.element.querySelectorAll('select option:checked').length;
  assert.equal(checkedCount, 3);

  // Multiple jQuery selectors
  const firstChecked = this.element.querySelector('.foo input:checked').value;
  const secondChecked = this.element.querySelector(this.element.querySelectorAll('.foo input:checked')[2]).value;
});
