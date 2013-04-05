var fs = require('fs');
var FILE = './bibref/biblio.js';
var INTRO = 'if (typeof berjon === "undefined") berjon = {};\nberjon.biblio = ';
var OUTRO = ";\n";

console.log("Loading " + FILE + " as JSON...");
var json = fs.readFileSync(FILE, 'utf8');
json = json.replace(INTRO, '').replace(/;\s*$/, '');
json = JSON.parse(json);

console.log("Sorting references...");
var keys = Object.keys(json).sort(function(a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()) });

var PREFIX = '    ';
function pad(str) {
    return str.split("\n").map(function(line) { return PREFIX + line; }).join("\n");
}

console.log("Normalizing references...");
var output = [];
keys.forEach(function(k) {
    output.push(pad('"' + k + '": ' + JSON.stringify(json[k], null, 4)));
});
output = "{\n" + output.join(",\n") + "\n}";

console.log("Verifying output...");
try {
    var json2 = JSON.parse(output);
    if (json2.length !== json.length) throw new Error("Lost some references in the process!");
} catch(e) {
    console.log(e);
    process.exit(1);
}

console.log("Writing output to " + FILE + "...");
fs.writeFileSync(FILE, INTRO + output + OUTRO, 'utf8');
