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
    return function asyncFunction() {
      const args = Array.from(arguments);
      const gen = (function*() {
        return (func.constructor.name === 'GeneratorFunction') ?
          yield* func.apply(self, args) : func.apply(self, args);
      }());
      try {
        return step(gen.next());
      } catch (err) {
        return Promise.reject(err);
      }
      function step(resultObj) {
        const p = Promise.resolve(resultObj.value); // Normalize thenables
        return (resultObj.done) ? p : p
          .then(result => step(gen.next(result)))
          .catch(error => step(gen.throw(error)));
      }
    };
  }

  async.task = (func, self) => async(func, self)();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = async;
  } else if (typeof define === 'function' && define.amd) {
    define('async', [], () => async);
  } else {
    (self || window).async = async;
  }
}
