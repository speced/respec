/*jshint  -W082 */
/*globals define, self*/
'use strict';
{
  // async function takes a generator, and optional "this"
  function async(func, self) {
    if (typeof func !== 'function') {
      throw new TypeError('Expected a Function or GeneratorFunction.');
    }
    // returns returns a function asyncFunction that returns promise
    // It is called with zero or more arguments...
    return function asyncFunction(...args) {
      const gen = (function*() {
        return (func.constructor.name === 'GeneratorFunction') ?
          yield* func.call(self, ...args) : func.call(self, ...args);
      }());
      try {
        return step(gen.next());
      } catch (err) {
        return Promise.reject(err);
      }
      function step({value, done}) {
        const p = Promise.resolve(value); // Normalize thenables
        return (done) ? p : p
          .then(result => step(gen.next(result)))
          .catch(error => step(gen.throw(error)));
      }
    };
  }

  async.task = (func, self) => async(func, self)();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = async;
  } else if (typeof define === 'function' && define.amd) {
    define([], () => async);
  } else {
    (self || window).async = async;
  }
}
