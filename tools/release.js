#!/usr/local/bin/node

"use strict";
var cmdPrompt = require("prompt");
var async = require("async");
var fs = require("fs-promise");
var pth = require("path");
var bwc = require("./build-w3c-common");
var Builder = require("./builder").Builder;
var exec = require("child_process").exec;

function rel(f) {
  return pth.join(__dirname, f);
};

cmdPrompt.start();

const Tasks = {
    // 1. Make sure you are up to date and on the develop branch (git up; git checkout develop)
    upToDateAndDev: async(function * () {
      const promptOps = {
        description: "Are you up to date and on branch develop",
        pattern: /^[yn]$/i,
        message: "Values can be 'y' or 'n'.",
        default: "y",
      };
      yield new Promise((resolve, reject) => {
        cmdPrompt.get(promptOps, (err, res) => {
          if (err) {
            return reject(new Error(err));
          }
          if (res.question.toLowerCase() === "n") {
            const error = new Error("Make sure to run git up; git checkout develop");
            return reject(error);
          }
          resolve();
        });
      })
    }),

    // 2. Bump the version in `package.json`.
    bumpVersion: async(function * () {
      const fileOps = {
        encoding: "utf8"
      };
      const version = yield Builder.getRespecVersion();
      if (!version) {
        throw new Error("Version string not found in package.json");
      }
      const newVersion = version.split(".");
      newVersion[2]++;
      newVersion = newVersion.join(".");
      const packagePath = rel("../package.json");
      const data = yield fsp.readFile(packagePath, fileOps);
      const pack = JSON.parse(data);
      pack.version = yield new Promise((resolve, reject) => {
        const promptOps = {
          description: `Current version is ${version}, bump it to`,
          pattern: /^\d+\.\d+\.\d+$/i,
          message: "Values must be x.y.z",
          default: newVersion
        };
        cmdPrompt.get(promptOps, (err, res) => {
          if (err) {
            return reject(new Error(err));
          }
          resolve(targetVersion);
        });
      });
      yield fs.writeFile(packagePath, JSON.stringify(pack, null, 2), fileOps);
      return pack.version;
    }),

    // 3. Run the build script (node tools/build-w3c-common.js). This should respond "OK!" (if not, fix the
    //    issue).
    // 4. Add the new build (git add builds/respec-w3c-common-3.x.y.js).
    // 5. Commit your changes (git commit -am v3.x.y)
    // 6. Merge to gh-pages (git checkout gh-pages; git merge develop)
    // 7. Tag the release (git tag v3.x.y) and be sure that git is pushing tags.
    buildAddCommitMergeTag: async(function * () {
        const promptOps = {
          description: "Are you ready to build, add, commit, merge, and tag",
          pattern: /^[yn]$/i,
          message: "Values can be 'y' or 'n'.",
          default: "y",
        };
        yield new Promise(resove, reject) => {
          cmdPrompt.get(promptOps, (err, res) => {
            var val = res.question.toLowerCase();
            if (err) {
              return reject(new Error(err));
            }
            if (val === "n") {
              return reject(new Error("User not ready."));
            }
            resolve();
          });
        });
    }),

  build: async(function * (targetVersion) {
    yield bwc.buildW3C(targetVersion);
  }),

  add: async(function * (targetVersion) {
    let path = rel("../builds/respec-w3c-common-" + targetVersion + ".js");
    path += rel(" ../builds/respec-w3c-common-" + targetVersion + ".js.map");
    yield toExecPromise("git add " + path);
  }),

  commit: async(function * (targetVersion) {
    yield toExecPromise("git commit -am v" + targetVersion);
  }),

  checkoutGHPages: async(function * () {
    yield toExecPromise("git checkout gh-pages");
  }),

  merge: async(function * () {
    yield toExecPromise("git merge develop");
  }),

  checkoutDevelop: async(function * () {
    yield toExecPromise("git checkout develop");
  }),

  tag: async(function * (targetVersion) {
    var version = "v" + targetVersion;
    yield toExecPromise(`git tag -m  ${version} ${version}`);
  }),

  // 8. Push everything back to the server (make sure you are pushing at least the `develop` and
  //    `gh-pages` branches).
  pushAll: async(function * () {
      cmdPrompt.get(

        {
          description: "Are you ready to push everything? This is your last chance",
          pattern: /^[yn]$/i,
          message: "Values can be 'y' or 'n'.",
          default: "y"
        },
        function(err, res) {
          var val = res.question.toLowerCase();
          if (err) {
            return cb(err);
          }
          if (val === "n") {
            return cb("User not ready! ABORT, ABORT!");
          }
          cb();
        }
      );
    },

    pushCommits: async(function * () {
      exec("git push --all", cb);
    }),

    pushTags: async(function * () {
      exec("git push --tags", cb);
    }),

    publishToNPM: async(function * () {
      exec("npm publish", cb);
    }),

    toExecPromise(cmd) {
      return new Promise((resolve, reject) => {
        const id = setTimeout(() => {
          reject(new Error(`Command took too long: ${cmd}`));
          proc.kill("SIGTERM");
        }, 20000);
        const proc = exec(cmd, (err, stdout) => {
          clearTimeout(id);
          if (err) {
            return reject(err);
          }
          resolve(stdout);
        });
      });
    },

  }


async.task(function * () {
  yield upToDateAndDev();
  const version = yield bumpVersion();
  yield buildAddCommitMergeTag();
  yield build();
  yield add();
  yield commit();
  yield checkoutGHPages();
  yield merge();
  yield checkoutDevelop();
  yield tag();
  yield pushAll();
  yield pushCommits();
  yield pushTags();
  yield publishToNPM();
  console.log("OK!");
});
