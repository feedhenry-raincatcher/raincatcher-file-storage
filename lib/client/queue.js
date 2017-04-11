'use strict';

var q = require('q'),
  _ = require('lodash');

/**
 * @param  {object} queue array of q items
 * @param {object} item meta-data model
 */
function _existsInQueue(item) {
  return _.find(_queue, { "id": item.id });
}

var _queue = [];
var _ready = false;

/**
 * @param {string} type
 * @param {string} cacheType
 */
var QUEUE = function(name) {
  this.queueName = 'wfm-file-' + name;
  this.count = 0;
};

QUEUE.prototype.saveQueue = function() {
  var d = q.defer();

  var toSave = JSON.stringify({
    count: _queue.length,
    queue: _queue
  });

  localStorage.setItem(this.queueName, toSave);

  d.resolve({
    saved: true,
    noOfItems: _queue.length
  });

  return d.promise;
};

QUEUE.prototype.recoverQueue = function() {
  var self = this;
  var d = q.defer();

  var queueData = localStorage.getItem(this.queueName);
  if (queueData !== null) {
    var fileData = JSON.parse(queueData);
    _queue = fileData.queue;
    this.count = _queue.length;

    d.resolve({
      recovered: true,
      noOfItems: this.count
    });
  } else {
    d.reject('Unable to recover queue.');
  }

  return d.promise;
};

/**
 * @param {object} item meta data model
 */
QUEUE.prototype.getList = function() {
  var d = q.defer();
  d.resolve(_queue);
  return d.promise;
};

/**
 * @param {object} item meta data model
 */
QUEUE.prototype.addItem = function(item) {
  var d = q.defer();
  if (_existsInQueue(item)) {
    console.log('Item already added to queue:', item.id);
    d.reject(true);
  } else {
    _queue.push(item);
    this.count = _queue.length;
    d.resolve(true);
    this.saveQueue();
  }
  return d.promise;
};

/**
 * @param {object} item meta data model
 */
QUEUE.prototype.removeItem = function(item) {
  var d = q.defer();
  if (!_existsInQueue(item)) {
    d.reject('Cannot find queue item.');
  } else {
    _.remove(_queue, item);
    this.count = this.count - 1;
    this.saveQueue();
    d.resolve(true);
  }
  return d.promise;
};

/**
 * @param {object} item meta data model
 */
QUEUE.prototype.updateItem = function(id, object) {
  var d = q.defer();
  _queue.filter(function(item) {
    if (item.id === id) {
      item = object;
      this.saveQueue();
      d.resolve(true);
    } else {
      d.reject('Queue item not updated');
    }
  });
  return d.promise;
};

/**
 * @param {object} item meta data model
 */
QUEUE.prototype.readItem = function(id) {
  var d = q.defer();
  _queue.filter(function(item) {
    if (item.id === id) {
      d.resolve(item);
    } else {
      d.reject('Unable to read queue item');
    }
  });
  return d.promise;
};

module.exports = QUEUE;