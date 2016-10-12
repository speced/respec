/*jshint  -W082 */
/*globals define*/
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
      return new Promise((resolve, reject) => {
        let gen;
        if (func.constructor.name === 'GeneratorFunction') {
          gen = func.call(self, ...args);
        } else { // Wrap it
          gen = (function*() {
            return func.call(self, ...args);
          }());
        }

        step(gen.next());

        function step({value, done}) {
          if (done) {
            return resolve(value);
          }
          Promise
            .resolve(value) // Normalize thenable
            .then(
              result => step(gen.next(result)),
              error => step(gen.throw(error))
            )
            .catch(reject);
        }
      });
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
