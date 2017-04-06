var CONSTANTS = require('../../constants');

/**
 * Initialising a subscriber for fetching file.
 *
 * @param {object} fileEntityTopics
 * @param fileClient
 */
module.exports = function getFileSubscribers(fileEntityTopics, storageClient) {
  
  /**
   * Handle fetching file binary data
   *
   * @param {object} parameters
   * @returns {*}
   */
  return function handleGetFileTopic(parameters) {
    var self = this;
    parameters = parameters || {};
    var errorTopic = fileEntityTopics.getTopic(CONSTANTS.TOPICS.GET, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

    if (!parameters.fileName) {
      return self.mediator.publish(errorTopic, new Error("Invalid Data To Create A File."));
    }
  
    storageClient.streamFile(parameters.namespace, parameters.fileName)
      .then(function(fileBuffer) {
        var doneTopic = fileEntityTopics.getTopic(CONSTANTS.TOPICS.GET, CONSTANTS.DONE_PREFIX, parameters.topicUid);
        self.mediator.publish(doneTopic, fileBuffer);
      })
      .catch(function(error) {
        self.mediator.publish(errorTopic, error);
      });
  };
};