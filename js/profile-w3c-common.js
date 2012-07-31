
define([
            "domReady"
        ,   "core/base-runner"
        ,   "core/override-configuration"
        ,   "core/default-root-attr"
        ,   "core/style"
        ,   "w3c/style"
        ,   "w3c/headers"
        ,   "w3c/abstract"
        ,   "w3c/conformance"
        ,   "core/data-transform"
        ,   "core/data-include"
        ,   "core/inlines"
        ,   "core/dfn"
        ,   "core/examples"
        ,   "core/issues-notes"
        ,   "core/highlight"
        ,   "core/best-practices"
        ,   "core/figures"
        ,   "w3c/legacy"
        ,   "core/webidl-oldschool"
        ,   "core/fix-headers"
        ,   "core/structure"
        ,   "w3c/informative"
        ,   "core/section-refs"
        ,   "core/id-headers"
        ,   "core/remove-respec"
        ],
        function (domReady, runner) {
            var args = Array.prototype.slice.call(arguments)
            ,   hasRun = false;
            domReady(function () {
                hasRun = true;
                runner.runAll(args);
            });
            // the below can trigger a run, assuming a way of starting this paused
            // window.addEventListener("message", function (ev) {
            //     console.log("message", ev.data);
            //     if (hasRun) return;
            //     if (ev.data && ev.data.topic == "run") {
            //         hasRun = true;
            //         runner.runAll(args);
            //     }
            // }, false);
        }
);

// TODO:
//  - UI
//      - have a core UI module that exposes menu(name, cb), warning(), error(), startTask(), endTask(), done()
//      - a small bullet in the top right corner, that can be closed
//      - [ ReSpec v | 9 | 5 ] where the name is a menu that exposes various options (including About ReSpec)
//        and that can be added to using menu(). Then is an orange count for warnings and a red count for errors
//        Both can be clicked for details. Both are invisible if there are no problems. warning()/error() serve
//        to feed those.
//      - startTask/endTask serve to show progress in a little menu below the bullet. done() ends it
//      - maybe use http://www.ryancollins.me/?p=1041
//  - all the save as stuff (without source option), added to the UI (separate module)
//  - a linter added to the menu (created using a separate module. the UI module needs to create a singleton in the conf
//    that all others can reuse)
//  - note that if we have a menu, we can drop shortcut.js!
//  - WebIDL porting
//      x give it a module of its own webidl-oldschool
//      x write a big set of tests for it (without touching anything else)
//      - make it use templates wherever possible
//      - then make it use jQuery
//      - drop simple-node
//  - make people() in headers use templates too
//  - RDFa
//      - search for RDFa throughout the code
//      - give it its own module, that hooks over whatever it needs in the tree
//  - bibref
//      - generate the proper data for webref
//      - add localReferences hash that follows the new service format
//      - kick the service in
//      - make sure that we still define berjon.biblio because some people do weird stuff that
//        accesses it. Read from it when generating the references.
//      - look at the referers for RSv2 to get a list of specs that still use that
//      - try to get those specs moved to RSv3
//      - integrate the biblio changes from CVS that haven't been already
//      - place a comment in that file asking for no updates to it
//      - announce all of this

// XXX - FROM RSv2
//  X    "core/base-runner",
//  X    "core/utils", (port in increments, only including the stuff that is depended upon -- avoids cruft)
//  X    "core/override-configuration",
//  X    "core/default-root-attr",
//  X    "core/style",
//  X    "w3c/style",
//  X    "w3c/headers",
//  X    conformance
//  X    "core/data-transform",
//  X    "core/data-include",
//  X    "core/inlines",
//      "core/webidl",
//  X    "core/examples",
//  X    highlight (these can be advantageously split out, since removing them saves a lot of code)
//  X    best practices
//  X    issues-notes (like examples)
//      "w3c/bibref",
//  X    "core/figure",
//  X    fix headers
//  X    "core/structure",
//  X    informative
//  X    section refs
//  X    "w3c/structure",
//  X    "core/dfn",
//      "core/rdfa", (note that we've deleted support here and there since it was spread everywhere -- reinstate from original v1)
//  X    "w3c/unhtml5",
//  X    "core/remove-respec"
