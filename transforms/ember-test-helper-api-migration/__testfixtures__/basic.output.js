import { setApplication, setResolver } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setResolver(engineResolverFor('shared-components'));

setApplication(Application.create(config.APP));
preloadAssets(manifest).then(start);
