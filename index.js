// Copyright (c) 2016 Patrick Dubroy <pdubroy@gmail.com>
// This software is distributed under the terms of the MIT License.

'use strict';

var fbemitter = require('fbemitter');
var inherits = require('inherits');

var ArrayProto = Array.prototype;

// CheckedEmitter
// --------------

function CheckedEmitter() {
  CheckedEmitter.super_.call(this);
  this._eventTypes = Object.create(null);
}
inherits(CheckedEmitter, fbemitter.EventEmitter);

// Register a new event type `eventType`. The remaining arguments are
// descriptive names of the arguments that will be passed to the callback.
// E.g., `e.register('propchange', 'propName', 'oldValue', 'newValue')`.
CheckedEmitter.prototype.register = function(eventType /* ...args */) {
  if (eventType in this._eventTypes) {
    throw new Error(
        "Event type '" + eventType + "' has already been registered");
  }
  this._eventTypes[eventType] = ArrayProto.slice.call(arguments, 1);
};

CheckedEmitter.prototype._checkEventType = function(type, optArrLike, what) {
  if (!(type in this._eventTypes)) {
    throw new TypeError("'" + type + "' is not a registered event type");
  }
  if (optArrLike) {
    var args = this._eventTypes[type];
    if (args.length !== optArrLike.length) {
      var message = 'Wrong ' + what + " for '" + type + "': " +
          'expected ' + args.length + ', got ' + optArrLike.length;
      throw new TypeError(message);
    }
  }
};

// The methods below here are all identical to those on fbemitter, except they
// throw an error if `eventType` does not match a registered event.
// See https://github.com/facebook/emitter for more info.

CheckedEmitter.prototype.addListener = function(eventType, callback) {
  this._checkEventType(eventType, callback, 'callback arity');
  return CheckedEmitter.super_.prototype.addListener.apply(this, arguments);
};

CheckedEmitter.prototype.once = function(eventType, callback) {
  this._checkEventType(eventType, callback, 'callback arity');
  return CheckedEmitter.super_.prototype.once.apply(this, arguments);
};

CheckedEmitter.prototype.removeAllListeners = function(optEventType) {
  if (optEventType) {
    this._checkEventType(optEventType);
  }
  return CheckedEmitter.super_.prototype.removeAllListeners.apply(
      this, arguments);
};

CheckedEmitter.prototype.listeners = function(eventType) {
  this._checkEventType(eventType);
  return CheckedEmitter.super_.prototype.listeners.apply(this, arguments);
};

CheckedEmitter.prototype.emit = function(eventType /* ...args */) {
  var args = ArrayProto.slice.call(arguments, 1);
  this._checkEventType(eventType, args, 'number of arguments');
  return CheckedEmitter.super_.prototype.emit.apply(this, arguments);
};

module.exports = CheckedEmitter;
