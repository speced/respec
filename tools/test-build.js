#!/usr/local/bin/node

var builder = require("./build-w3c-common");

builder.buildW3C(false, function () {
    console.log("Script built");
});
