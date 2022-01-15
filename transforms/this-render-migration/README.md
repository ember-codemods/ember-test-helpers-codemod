# this-render-migration
This codemod transform is to replace deprecated this.render() with render() from '@ember/test-helpers' package

## Usage

```
npx ember-test-helpers-codemod this-render-migration path/of/files/ or/some**/*glob.js

# or

yarn global add ember-test-helpers-codemod
ember-test-helpers-codemod this-render-migration path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
* [has-no-ember-test-helpers-import](#has-no-ember-test-helpers-import)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/this-render-migration/__testfixtures__/basic.input.js)</small>):
```js
import { click } from '@ember/test-helpers';

test('It handles switching selected option on click and fires onSelect event', async function(assert) {
    this.onSelectMock = this.sandbox.stub();
    await this.render(hbs`
      <Common::TimeCommitmentSelector @timeCommitmentOptions={{timeCommitmentOptionsMock}} @onSelect={{onSelectMock}}>
      </Common::TimeCommitmentSelector>
    `);
})

```

**Output** (<small>[basic.output.js](transforms/this-render-migration/__testfixtures__/basic.output.js)</small>):
```js
import { click, render } from '@ember/test-helpers';

test('It handles switching selected option on click and fires onSelect event', async function(assert) {
    this.onSelectMock = this.sandbox.stub();
    await render(hbs`
      <Common::TimeCommitmentSelector @timeCommitmentOptions={{timeCommitmentOptionsMock}} @onSelect={{onSelectMock}}>
      </Common::TimeCommitmentSelector>
    `);
})

```
---
<a id="has-no-ember-test-helpers-import">**has-no-ember-test-helpers-import**</a>

**Input** (<small>[has-no-ember-test-helpers-import.input.js](transforms/this-render-migration/__testfixtures__/has-no-ember-test-helpers-import.input.js)</small>):
```js
test('It handles switching selected option on click and fires onSelect event', async function(assert) {
    this.onSelectMock = this.sandbox.stub();
    await this.render(hbs`
      <Common::TimeCommitmentSelector @timeCommitmentOptions={{timeCommitmentOptionsMock}} @onSelect={{onSelectMock}}>
      </Common::TimeCommitmentSelector>
    `);
})

```

**Output** (<small>[has-no-ember-test-helpers-import.output.js](transforms/this-render-migration/__testfixtures__/has-no-ember-test-helpers-import.output.js)</small>):
```js
import { render } from '@ember/test-helpers';
test('It handles switching selected option on click and fires onSelect event', async function(assert) {
    this.onSelectMock = this.sandbox.stub();
    await render(hbs`
      <Common::TimeCommitmentSelector @timeCommitmentOptions={{timeCommitmentOptionsMock}} @onSelect={{onSelectMock}}>
      </Common::TimeCommitmentSelector>
    `);
})

```
<!--FIXTURES_CONTENT_END-->