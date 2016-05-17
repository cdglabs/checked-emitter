# checked-emitter

An EventEmitter implementation that wraps [fbemitter](https://github.com/facebook/emitter)
with checks to ensure that event types are always registered before use.

## Usage

```js
var CheckedEmitter = require('checked-emitter');
var e = new CheckedEmitter();

e.register('propchange', 'propName', 'oldValue', 'newValue');
e.addListener('propchange', function(name, oldValue, newValue) {
  ...
});
e.emit('propchange', 'count', 3, 4);
```

With the exception of `register`, the API is identical to fbemitter.
