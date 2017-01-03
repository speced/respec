// Module core/shiv
// Injects the HTML5 shiv conditional comment
"use strict"
define([], function() {
  var txt = "[if lt IE 9]><script src='https://www.w3.org/2008/site/js/html5shiv.js'></script><![endif]";
  var cmt = document.createComment(txt);
  document.head.appendChild(cmt);
  return {}
});
