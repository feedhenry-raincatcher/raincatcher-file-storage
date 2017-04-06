var _ = require('lodash');
var CONSTANTS = require('../../constants');


/**
 * Initialising a subscriber for creating a file.
 *
 * @param {object} fileEntityTopics
 * @param fileClient
 */
module.exports = function createFileSubscriber(fileEntityTopics, storageClient) {
  
  /**
   * Handling the file upload
   *
   * @param {object} parameters
   * @returns {*}
   */
  return function handleCreateFileTopic(parameters) {
    var self = this;
    parameters = parameters || {};
    var fileCreateErrorTopic = fileEntityTopics.getTopic(CONSTANTS.TOPICS.CREATE, CONSTANTS.ERROR_PREFIX, parameters.topicUid);
    if (!parameters.fileName || !parameters.location) {
      return self.mediator.publish(fileCreateErrorTopic, new Error("Invalid Data To Create A File."));
    }
    storageClient.writeFile(parameters.namespace, parameters.fileName, parameters.location)
      .then(function(response) {
        self.mediator.publish(fileEntityTopics.getTopic(CONSTANTS.TOPICS.CREATE, CONSTANTS.DONE_PREFIX, parameters.topicUid), response);
      })
      .catch(function(error) {
        self.mediator.publish(fileCreateErrorTopic, error);
      });
  };
};