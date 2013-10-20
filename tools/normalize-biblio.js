var fs = require('fs');
var FILE = './bibref/biblio.js';
var INTRO = 'if (typeof berjon === "undefined") berjon = {};\nberjon.biblio = ';
var OUTRO = ";\n";

console.log("Loading " + FILE + " as JSON...");
var json = fs.readFileSync(FILE, 'utf8');
json = json.replace(INTRO, '').replace(/;\s*$/, '');
json = JSON.parse(json);

console.log("Sorting references...");

var output = Object.keys(json).sort(function(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase())
}).reduce(function(output, k) {
    output[k] = json[k];
    return output;
}, {});

console.log("Writing output to " + FILE + "...");
fs.writeFileSync(FILE, INTRO + JSON.stringify(output, null, 4) + OUTRO, 'utf8');
