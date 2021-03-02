# ember-test-helper-api-migration
This codemod transfer is to migrate deprecated package `ember-test-helpers` to package `@ember/test-helpers`

## Usage

```
npx ember-test-helpers-codemod ember-test-helper-api-migration path/of/files/ or/some**/*glob.js

# or

yarn global add ember-test-helpers-codemod
ember-test-helpers-codemod ember-test-helper-api-migration path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
* [do-not-have-@ember-test-helpers-import](#do-not-have-@ember-test-helpers-import)
* [do-not-have-ember-test-helpers-import](#do-not-have-ember-test-helpers-import)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/ember-test-helper-api-migration/__testfixtures__/basic.input.js)</small>):
```js
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import { setResolver } from 'ember-test-helpers';
```

**Output** (<small>[basic.input.js](transforms/ember-test-helper-api-migration/__testfixtures__/basic.output.js)</small>):
```js
import { setApplication, setResolver } from '@ember/test-helpers';
import { start } from 'ember-qunit';
```
---
<a id="do-not-have-@ember-test-helpers-import">**do-not-have-@ember-test-helpers-import**</a>

**Input** (<small>[do-not-have-@ember-test-helpers-import.input.js](transforms/ember-test-helper-api-migration/__testfixtures__/do-not-have-@ember-test-helpers-import.input.js)</small>):
```js
import { start } from 'ember-qunit';
import { setResolver } from 'ember-test-helpers';
```

**Output** (<small>[do-not-have-@ember-test-helpers-import.input.js](transforms/ember-test-helper-api-migration/__testfixtures__/do-not-have-@ember-test-helpers-import.output.js)</small>):
```js
import { setResolver } from '@ember/test-helpers';
import { start } from 'ember-qunit';
```
---
<a id="do-not-have-ember-test-helpers-import">**do-not-have-ember-test-helpers-import**</a>

**Input** (<small>[do-not-have-ember-test-helpers-import.input.js](transforms/ember-test-helper-api-migration/__testfixtures__/do-not-have-ember-test-helpers-import.input.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});
```

**Output** (<small>[do-not-have-ember-test-helpers-import.input.js](transforms/ember-test-helper-api-migration/__testfixtures__/do-not-have-ember-test-helpers-import.output.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});
```
<!--FIXTURE_CONTENT_END-->