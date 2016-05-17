'use strict';

let CheckedEmitter = require('..');
let test = require('tape');

function noop() {}

test('basic', t => {
  let e = new CheckedEmitter();
  t.throws(() => e.addListener('x', noop), /not a registered event/);
  t.throws(() => e.once('x', noop), /not a registered event/);
  t.throws(() => e.removeAllListeners('x', noop), /not a registered event/);
  t.throws(() => e.listeners('x', noop), /not a registered event/);
  t.throws(() => e.emit('x'), /not a registered event/);

  e.register('x', 'count');
  t.throws(() => e.emit('x'), /expected 1, got 0/);

  let total = 0;
  e.addListener('x', count => { total += count; });
  e.emit('x', 1);
  t.equal(total, 1);

  t.equal(e.listeners('x').length, 1);
  e.removeAllListeners('x');
  t.equal(e.listeners('x').length, 0);

  t.throws(() => e.register('x'), /Event type 'x' has already been registered/);
  e.emit('x', 2);
  t.equal(total, 1, 'total is still the same (no listeners)');

  t.end();
});
