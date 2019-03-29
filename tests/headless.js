#!/usr/bin/env node
// @ts-check
/* eslint-env node */
"use strict";

const { debug } = require("./respec2htmlTests/utils");

const runRespec2html = require("./respec2htmlTests/r2h");

async function run() {
  debug(" ⏲  Running ReSpec2html tests...");
  try {
    await runRespec2html();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
  process.exit(0);
}

run();
