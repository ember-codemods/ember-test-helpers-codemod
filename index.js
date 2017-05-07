const integrationPreset = require('./lib/presets/integration');

module.exports = function(file, api, options) {
  // TODO: Create an `acceptancePreset` and use it depending on some
  // entry of the `options` argument.
  return integrationPreset(file, api, options);
};