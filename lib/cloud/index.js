var mediatorSubscribers = require('./mediator-subscribers');
var StorageEngine = require('./file-storage');

/**
 * Initialisation of the file storage module.
 *
 * @param {Mediator} mediator
 * @param {object}  config -  module configuration
 */
module.exports = function(mediator, config) {
  //Initialising the subscribers to topics that the module is interested in.
  var storageEngine = StorageEngine(config);
  return mediatorSubscribers.init(mediator, storageEngine);
};