'use strict';

const fs = require('fs');
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

module.exports = function testRunner(type) {
  let fixturesPath = `${__dirname}/../__testfixtures__/${type}`;

  fs.readdirSync(fixturesPath).forEach(fixture => {
    let match = fixture.match(/(.*)\.input\.js$/);
    if (match) {
      defineTest(__dirname, 'index', { type }, `${type}/${match[1]}`);
    }
  });
};
