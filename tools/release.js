#!/usr/local/bin/node

var prompt = require("prompt");
var async = require("async");
var fs = require("fs");
var pth = require("path");
var bwc = require("./build-w3c-common");
var exec = require("child_process").exec;
var rfs = function (f) {
  return fs.readFileSync(f, {
    encoding: "utf8"
  });
};
var wfs = function (f, data) {
  return fs.writeFileSync(f, data, {
    encoding: "utf8"
  });
};
var rel = function (f) {
  return pth.join(__dirname, f);
};
var targetVersion;

prompt.start();

// 1. Make sure you are up to date and on the develop branch (git up; git checkout develop)
function upToDateAndDev(cb) {
  prompt.get({
    description: "Are you up to date and on branch develop",
    pattern: /^[yn]$/i,
    message: "Values can be 'y' or 'n'.",
    default: "y"
  }, function (err, res) {
    var val = res.question.toLowerCase();
    if (err) return cb(err);
    if (val === "n") return cb("Make sure to run git up; git checkout develop");
    cb();
  });
}

// 2. Bump the version in `package.json`.
function bumpVersion(cb) {
  var pack = rfs(rel("../package.json"));
  var version = pack.match(/"version"\s*:\s*"([\d\.]+)"/)[1];
  if (!version) cb("Version string not found in package.json");
  var newVersion = version.split(".");
  newVersion[2]++;
  newVersion = newVersion.join(".");
  prompt.get({
    description: "Current version is " + version + ", bump it to",
    pattern: /^\d+\.\d+\.\d+$/i,
    message: "Values must be x.y.z",
    default: newVersion
  }, function (err, res) {
    targetVersion = res.question;
    if (err) return cb(err);
    pack = pack.replace(/("version"\s*:\s*")[\d\.]+(")/, "$1" + targetVersion + "$2");
    wfs(rel("../package.json"), pack);
    cb();
  });
}

// 3. Run the build script (node tools/build-w3c-common.js). This should respond "OK!" (if not, fix the
//    issue).
// 4. Add the new build (git add builds/respec-w3c-common-3.x.y.js).
// 5. Commit your changes (git commit -am v3.x.y)
// 6. Merge to gh-pages (git checkout gh-pages; git merge develop)
// 7. Tag the release (git tag v3.x.y) and be sure that git is pushing tags.
function buildAddCommitMergeTag(cb) {
  prompt.get({
    description: "Are you ready to build, add, commit, merge, and tag",
    pattern: /^[yn]$/i,
    message: "Values can be 'y' or 'n'.",
    default: "y"
  }, function (err, res) {
    var val = res.question.toLowerCase();
    if (err) return cb(err);
    if (val === "n") return cb("User not ready! ABORT, ABORT!");
    cb();
  });
}

function build(cb) {
  bwc.buildW3C(targetVersion, cb);
}

function add(cb) {
  var path = rel("../builds/respec-w3c-common-" + targetVersion + ".js");
  exec("git add " + path, cb);
}

function commit(cb) {
  exec("git commit -am v" + targetVersion, cb);
}

function checkoutGHPages(cb) {
  exec("git checkout gh-pages", cb);
}

function merge(cb) {
  exec("git merge develop", cb);
}

function checkoutDevelop(cb) {
  exec("git checkout develop", cb);
}

function tag(cb) {
  var version = "v"+ targetVersion;
  exec("git tag -m " + version + " " + version, cb);
}

// 8. Push everything back to the server (make sure you are pushing at least the `develop` and
//    `gh-pages` branches).
function pushAll(cb) {
  prompt.get(

    {
      description: "Are you ready to push everything? This is your last chance",
      pattern: /^[yn]$/i,
      message: "Values can be 'y' or 'n'.",
      default: "y"
    },
    function (err, res) {
      var val = res.question.toLowerCase();
      if (err) return cb(err);
      if (val === "n") return cb("User not ready! ABORT, ABORT!");
      cb();
    }
  );
}

function pushCommits(cb) {
  exec("git push --all", cb);
}

function pushTags(cb) {
  exec("git push --tags", cb);
}

async.series([
  upToDateAndDev, bumpVersion, buildAddCommitMergeTag, build, add, commit, checkoutGHPages, merge, checkoutDevelop, tag, pushAll, pushCommits, pushTags
], function (err) {
  if (err) console.error("ERROR:", err);
  else console.log("OK!");
});
