#!/usr/local/bin/node

var builder = require("./build-w3c-common");

console.log("before call to buildW3C");
builder.buildW3C(false, function () {
    console.log("Script built");
});
console.log("after call to buildW3C");
