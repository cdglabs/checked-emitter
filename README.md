# checked-emitter

An EventEmitter implementation that wraps [fbemitter](https://github.com/facebook/emitter)
with checks to ensure that event types are always registered before use.

## Usage

```js
var CheckedEmitter = require('checked-emitter');
var e = new CheckedEmitter();

e.registerEvent('propchange', 'propName', 'oldValue', 'newValue');
e.addListener('propchange', function(name, oldValue, newValue) {
  ...
});
e.emit('propchange', 'count', 3, 4);
```

## API

The API is the same as fbemitter.EventEmitter, with the following additions:

### `registerEvent(eventType, ...params)`

Register a new event to be emitted. `eventType` is a String, `params` are
parameter names for the event.

### `registerEvents(obj)`

Shorthand for registering multiple events. `obj` is a mapping {String : Array}
of event types to parameter names.

### `events()`

Return an Array of objects representing the events that have been registered on
this emitter.
