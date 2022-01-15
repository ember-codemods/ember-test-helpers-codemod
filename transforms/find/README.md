# find


## Usage

```
npx ember-test-helpers-codemod find path/of/files/ or/some**/*glob.js

# or

yarn global add ember-test-helpers-codemod
ember-test-helpers-codemod find path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [find](#find)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="find">**find**</a>

**Input** (<small>[find.input.js](transforms/find/__testfixtures__/find.input.js)</small>):
```js
import { find, findAll } from '@ember/test-helpers';

test('it renders', function(assert) {
  assert.equal(find('.foo').textContent.trim(), 'bar');
  assert.equal(findAll('.bar').length, 2);
});
```

**Output** (<small>[find.output.js](transforms/find/__testfixtures__/find.output.js)</small>):
```js
test('it renders', function(assert) {
  assert.equal(this.element.querySelector('.foo').textContent.trim(), 'bar');
  assert.equal(this.element.querySelectorAll('.bar').length, 2);
});
```
<!--FIXTURES_CONTENT_END-->