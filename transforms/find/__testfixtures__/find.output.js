test('it renders', function(assert) {
  assert.equal(this.element.querySelector('.foo').textContent.trim(), 'bar');
  assert.equal(this.element.querySelectorAll('.bar').length, 2);
});