#!/usr/bin/env bash

# Delete dependent files
rm ./js/deps/*.* ./js/core/css/github.css

# Copy them again
cp ./node_modules/promise-polyfill/promise.js ./js/deps/
cp ./node_modules/js-beautify/js/lib/beautify-css.js ./js/deps/
cp ./node_modules/js-beautify/js/lib/beautify-html.js ./js/deps/
cp ./node_modules/js-beautify/js/lib/beautify.js ./js/deps/
cp ./node_modules/domReady/domReady.js ./js/deps/
cp ./node_modules/whatwg-fetch/fetch.js ./js/deps/
cp ./node_modules/handlebars/dist/handlebars.js ./js/deps/
cp ./node_modules/highlight.js/build/highlight.pack.js ./js/deps/highlight.js
cp ./node_modules/jquery/dist/jquery.js ./js/deps/
cp ./node_modules/marked/lib/marked.js ./js/deps/
cp ./node_modules/requirejs/require.js ./js/deps/
cp ./node_modules/text/text.js ./js/deps/
cp ./node_modules/webidl2/lib/webidl2.js ./js/deps/
cp ./node_modules/highlight.js/src/styles/github.css ./js/core/css/