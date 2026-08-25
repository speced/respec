"use strict";

// Guards the karma-jasmine `client.jasmine.timeoutInterval` in
// tests/karma.conf.base.cjs. A misspelled or misplaced karma client option is
// silently ignored, so without this the suites would quietly fall back to
// jasmine's 5s default and the flaky timeouts would return unnoticed.
describe("Karma config", () => {
  it("raises the jasmine spec timeout above the 5s default", () => {
    expect(jasmine.DEFAULT_TIMEOUT_INTERVAL).toBe(15000);
  });
});
