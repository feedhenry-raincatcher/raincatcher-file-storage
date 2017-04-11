'use strict';

var q = require('q')
var queue = require('./queue');
var shortid = require('shortid');
var $fh = require('fh-js-sdk');
var localFS = require('./local-fs');
var moduleName = 'wfm-mobile.filemanager';

module.exports = moduleName;

var ngFIleManager;
try {
  ngFIleManager = angular.module(moduleName);
} catch (e) {
  ngFIleManager = angular.module(moduleName, []);
}

ngFIleManager.factory('fileManager', function(mediator) {
  var ftpQueues = {
    uploads: new queue('uploads'),
  };

  var data = {};

  var hasNetworkConnection = function(cb) {
    $fh.cloud({
      method: 'GET',
      path: 'sys/info/ping'
    }, function(res) {
      if(res === "OK") {
        return cb(true);
      } else {
        return cb(false);
      }
    }, function(msg, err) {
      return cb(false);
    });
  };

  var getFiles = function(userId) {
    var parameters = {
      userId : userId
    };

    mediator.publish("wfm:files:list", parameters);
  }

  var getQueue = function(name) {
    var d = q.defer();
    var hasQueue  = ftpQueues[name];

    if (hasQueue) {
      d.resolve(ftpQueues[name])
    } else {
      d.reject('Queue (' + name + ') cannot be found.');
    }

    return d.promise;
  };

  var startFileUpload = function(queueItems) {
      if (queueItems && queueItems.length > 0) {
        queueItems.forEach(function(item) {

          var params = {
            fileToCreate: item, // A Valid JSON Object
            id: item.id,
            topicUid: "signature-upload" //Optional topic unique identifier.
          };

          mediator.publish('wfm:files:create', params);
        });
      }
  };

  var writeFile = function(name, contentType, data) {
    if (localFS.ready) {
      return localFS.writeFile(name, contentType, data);
    }
  };

  var removeFromQueue = function(name, id, object) {
    return ftpQueues[name].removeItem(object);
  };

  var updateQueueItem = function(name, id, object) {
    return ftpQueues[name].updateItem(id, object);
  };

  return {
    data: data,
    hasNetworkConnection: hasNetworkConnection,
    getQueue: getQueue,
    startFileUpload: startFileUpload,
    writeFile: writeFile,
    removeFromQueue: removeFromQueue,
    updateQueueItem: updateQueueItem
  };
});