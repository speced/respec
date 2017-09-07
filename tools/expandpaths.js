#!/usr/bin/env node

"use strict";
const glob = require("glob");

const expanded = process.argv
  .slice(2)
  .map(path => glob.sync(path, { nonull: true }))
  .reduce((res, file) => res.concat(file), [])
  .join(" ");
process.stdout.write(expanded);
