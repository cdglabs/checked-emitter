// Copyright (c) 2016 Patrick Dubroy <pdubroy@gmail.com>
// This software is distributed under the terms of the MIT License.

'use strict';

var EventEmitter = require('fbemitter').EventEmitter;
var inherits = require('inherits');

var ArrayProto = Array.prototype;

// CheckedEmitter
// --------------

function CheckedEmitter() {
  EventEmitter.call(this);
  this._eventTypes = Object.create(null);
}
inherits(CheckedEmitter, EventEmitter);
var SUPER_PROTO = EventEmitter.prototype;

// Register a new event type `eventType`. The remaining arguments are
// descriptive names of the arguments that will be passed to the callback.
// E.g., `e.register('propchange', 'propName', 'oldValue', 'newValue')`.
CheckedEmitter.prototype.registerEvent = function(eventType /* ...args */) {
  if (eventType in this._eventTypes) {
    throw new Error(
        "Event type '" + eventType + "' has already been registered");
  }
  var params = ArrayProto.slice.call(arguments, 1);
  this._eventTypes[eventType] = {name: eventType, params: params};
};

// Shorthand for registering multiple events at once.
// `obj` is a map of event types to an Array of event parameters.
CheckedEmitter.prototype.registerEvents = function(obj) {
  var self = this;
  Object.keys(obj).forEach(function(name) {
    self.registerEvent.apply(self, [name].concat(obj[name]));
  });
};

// Return an Array of objects representing every event that has been
// registered on this emitter.
CheckedEmitter.prototype.events = function() {
  var self = this;
  return Object.keys(this._eventTypes).map(function(name) {
    return self._eventTypes[name];
  });
};

CheckedEmitter.prototype._checkEventType = function(type, optArrLike, what) {
  if (!(type in this._eventTypes)) {
    throw new TypeError("'" + type + "' is not a registered event type");
  }
  if (optArrLike) {
    var evt = this._eventTypes[type];
    if (evt.params.length !== optArrLike.length) {
      var message = 'Wrong ' + what + " for '" + type + "': " +
          'expected ' + evt.params.length + ', got ' + optArrLike.length;
      throw new TypeError(message);
    }
  }
};

// The methods below here are all identical to those on fbemitter, except they
// throw an error if `eventType` does not match a registered event.
// See https://github.com/facebook/emitter for more info.

CheckedEmitter.prototype.addListener = function(eventType, callback) {
  this._checkEventType(eventType, callback, 'callback arity');
  return SUPER_PROTO.addListener.apply(this, arguments);
};

CheckedEmitter.prototype.once = function(eventType, callback) {
  this._checkEventType(eventType, callback, 'callback arity');
  return SUPER_PROTO.once.apply(this, arguments);
};

CheckedEmitter.prototype.removeAllListeners = function(optEventType) {
  if (optEventType) {
    this._checkEventType(optEventType);
  }
  return SUPER_PROTO.removeAllListeners.apply(this, arguments);
};

CheckedEmitter.prototype.listeners = function(eventType) {
  this._checkEventType(eventType);
  return SUPER_PROTO.listeners.apply(this, arguments);
};

CheckedEmitter.prototype.emit = function(eventType /* ...args */) {
  var args = ArrayProto.slice.call(arguments, 1);
  this._checkEventType(eventType, args, 'number of arguments');
  return SUPER_PROTO.emit.apply(this, arguments);
};

module.exports = CheckedEmitter;
