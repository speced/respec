#!/usr/local/bin/node

 // check that we are in a release branch
 // get the version number from somewhere
 // be sure to include RequireJS as a dependency so that just a single file can be loaded
 //   node ../../r.js -o baseUrl=. paths.requireLib=../../require name=main include=requireLib out=main-built.js
 // the important parts above are the mapping from paths.requireLib to the require.js source and the include
 // note that we can load r.js here and use its API to drive the above (rather than shelling out)
 // for the time being, we also need to specify the biblio as a dependency -- that will change of course
 // output both
 //   builds/respec-w3c-common.js (latest)
 //   builds/respec-w3c-common-3.0.7.js (specific version)

