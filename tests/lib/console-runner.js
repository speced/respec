/**
 Jasmine Reporter that outputs test results to the browser console.
 Useful for RUNNING in a headless environment such as PhantomJs, ZombieJs etc.

 Usage:
 // From your html file that loads jasmine:
 jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
 jasmine.getEnv().execute();
*/

(function(jasmine, console) {
  if (!jasmine) {
    throw "jasmine library isn't loaded!";
  }

  var ConsoleReporter = function() {
    if (!console || !console.log) { throw "console isn't present!"; }
    this.status = this.statuses.STOPPED;
  };

  var proto = ConsoleReporter.prototype;
  proto.statuses = {
    STOPPED : 3,
    RUNNING : 2,
    FAIL    : 1,
    SUCCESS : 0
  };

  proto.reportRunnerStarting = function(runner) {
    this.status = this.statuses.RUNNING;
    this.start_time = (new Date()).getTime();
    this.executed_specs = 0;
    this.passed_specs = 0;
    this.log("Starting...");
  };

  proto.reportRunnerResults = function(runner) {
    var failed = this.executed_specs - this.passed_specs;
    var spec_str = this.executed_specs + (this.executed_specs === 1 ? " spec, " : " specs, ");
    var fail_str = failed + (failed === 1 ? " failure in " : " failures in ");
    this.end_time = (new Date()).getTime();
    this.total_time = this.end_time - this.start_time;

    this.log("");
    this.log("Finished");
    this.log("-----------------");
    this.log(spec_str + fail_str + (this.total_time/1000) + "s.");

    this.status = (failed > 0)? this.statuses.FAIL : this.statuses.SUCCESS;

    /* Print something that signals that testing is over so that headless browsers
       like PhantomJs know when to terminate. */
    this.log("");
    this.log("ConsoleReporter finished");
  };


  proto.reportSpecStarting = function(spec) {
    this.executed_specs++;
  };

  proto.reportSpecResults = function(spec) {

    var resultText = spec.suite.description + " : " + spec.description;

    if (spec.results().passed()) {
         this.passed_specs++;
         this.log("ok " + this.executed_specs + ' - ' + resultText);
         return;
    }
    this.log("not ok " + this.executed_specs + ' - ' + resultText);

    var items = spec.results().getItems()
    for (var i = 0; i < items.length; i++) {
      var trace = items[i].trace.stack || items[i].trace;
      this.log(JSON.stringify(trace, null, 4));
    }
  };

  proto.reportSuiteResults = function(suite) {
    if (!suite.parentSuite) { return; }
    var results = suite.results();
    var failed = results.totalCount - results.passedCount;
    this.log(suite.getFullName() + ": " + results.passedCount + " of " + results.totalCount + " passed.");
  };

  proto.log = function(text) {
    console.log("JASMINE: " + text)
  };

  jasmine.ConsoleReporter = ConsoleReporter;
})(jasmine, console);
