'use strict';

let CheckedEmitter = require('..');
let test = require('tape');

function noop() {}

test('exceptions', t => {
  let e = new CheckedEmitter();
  t.throws(() => e.addListener('x', noop), /not a registered event/);
  t.throws(() => e.once('x', noop), /not a registered event/);
  t.throws(() => e.removeAllListeners('x', noop), /not a registered event/);
  t.throws(() => e.listeners('x', noop), /not a registered event/);
  t.throws(() => e.emit('x'), /not a registered event/);

  e.registerEvent('x', 'count');
  t.throws(() => e.emit('x'), /expected 1, got 0/);

  t.end();
});

test('registerEvent()', t => {
  let e = new CheckedEmitter();
  let total = 0;

  e.registerEvent('x', 'count');
  e.addListener('x', count => { total += count; });
  e.emit('x', 1);
  t.equal(total, 1);

  t.throws(() => e.registerEvent('x'),
           /Event type 'x' has already been registered/);
  e.emit('x', 2);
  t.equal(total, 3);

  t.end();
});

test('listeners()', t => {
  let e = new CheckedEmitter();

  e.registerEvent('x');
  e.addListener('x', () => t.fail('should not be hit'));
  t.equal(e.listeners('x').length, 1);
  e.removeAllListeners('x');
  t.equal(e.listeners('x').length, 0);
  e.emit('x');

  t.end();
});

test('registerEvents() and events()', t => {
  let e = new CheckedEmitter();
  e.registerEvent('z');
  e.registerEvents({});
  t.deepEqual(e.events(), [{name: 'z', params: []}]);

  e.registerEvents({
    x: ['a', 'b'],
    y: []
  });
  t.deepEqual(e.events(), [
    {name: 'z', params: []},
    {name: 'x', params: ['a', 'b']},
    {name: 'y', params: []}
  ]);
  e.addListener('x', (a, b) => null);
  e.emit('x', 1, 2);
  e.emit('y');
  e.emit('z');

  t.end();
});
