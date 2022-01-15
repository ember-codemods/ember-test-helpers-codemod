# ember-test-helper-api-migration
This codemod is to migrate deprecated package `ember-test-helpers` to package `@ember/test-helpers`

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
* [test-context-specifier](#test-context-specifier)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/ember-test-helper-api-migration/__testfixtures__/basic.input.js)</small>):
```js
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import { setResolver } from 'ember-test-helpers';

setResolver(engineResolverFor('shared-components'));

setApplication(Application.create(config.APP));
preloadAssets(manifest).then(start);

```

**Output** (<small>[basic.output.js](transforms/ember-test-helper-api-migration/__testfixtures__/basic.output.js)</small>):
```js
import { setApplication, setResolver } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setResolver(engineResolverFor('shared-components'));

setApplication(Application.create(config.APP));
preloadAssets(manifest).then(start);

```
---
<a id="do-not-have-@ember-test-helpers-import">**do-not-have-@ember-test-helpers-import**</a>

**Input** (<small>[do-not-have-@ember-test-helpers-import.input.js](transforms/ember-test-helper-api-migration/__testfixtures__/do-not-have-@ember-test-helpers-import.input.js)</small>):
```js
import { start } from 'ember-qunit';
import { setResolver } from 'ember-test-helpers';

setResolver(engineResolverFor('shared-components')); 
 
setApplication(Application.create(config.APP)); 
preloadAssets(manifest).then(start); 

```

**Output** (<small>[do-not-have-@ember-test-helpers-import.output.js](transforms/ember-test-helper-api-migration/__testfixtures__/do-not-have-@ember-test-helpers-import.output.js)</small>):
```js
import { setResolver } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setResolver(engineResolverFor('shared-components')); 
 
setApplication(Application.create(config.APP)); 
preloadAssets(manifest).then(start); 

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

**Output** (<small>[do-not-have-ember-test-helpers-import.output.js](transforms/ember-test-helper-api-migration/__testfixtures__/do-not-have-ember-test-helpers-import.output.js)</small>):
```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Component | foo bar', {
  integration: true
});

```
---
<a id="test-context-specifier">**test-context-specifier**</a>

**Input** (<small>[test-context-specifier.input.js](transforms/ember-test-helper-api-migration/__testfixtures__/test-context-specifier.input.js)</small>):
```js
import { click } from '@ember/test-helpers';
import { TestContext } from 'ember-test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';


module(
  'Integration | Component | c-pages/recommendations/collections/detail/collection-detail-card-list',
  function (hooks) {
    setupRenderingTest(hooks);

    /** @type {TestContext['setProperties']} */
    let setProperties;

    hooks.beforeEach(function () {
      setProperties = this.setProperties;

      this.owner.register(
        'service:lls-content-library@configuration',
        ConfigurationStub
      );
    });

    test('it renders detail view', async function (assert) {
      await renderComponent({
        learningCollectionItems,
        locale,
        isEditable: false
      });

      assert
        .dom(SELECTORS.DROPDOWN_BUTTON)
        .doesNotExist(
          'It does not render dropdown button when `isEditable` is falsey'
        );
    });
  }
);

```

**Output** (<small>[test-context-specifier.output.js](transforms/ember-test-helper-api-migration/__testfixtures__/test-context-specifier.output.js)</small>):
```js
import { click, TestContext } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';


module(
  'Integration | Component | c-pages/recommendations/collections/detail/collection-detail-card-list',
  function (hooks) {
    setupRenderingTest(hooks);

    /** @type {TestContext['setProperties']} */
    let setProperties;

    hooks.beforeEach(function () {
      setProperties = this.setProperties;

      this.owner.register(
        'service:lls-content-library@configuration',
        ConfigurationStub
      );
    });

    test('it renders detail view', async function (assert) {
      await renderComponent({
        learningCollectionItems,
        locale,
        isEditable: false
      });

      assert
        .dom(SELECTORS.DROPDOWN_BUTTON)
        .doesNotExist(
          'It does not render dropdown button when `isEditable` is falsey'
        );
    });
  }
);

```
<!--FIXTURES_CONTENT_END-->