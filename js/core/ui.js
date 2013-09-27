/*global respecEvents */

// Module core/ui
// Handles the ReSpec UI


// XXX TODO
//  - move all the saving code from legacy to ui/save-html
//  - make a decent menu for save-html
//  - try saving with FileSaver or <a download>
//  - allow addCommand to get a keyboard shortcut
//  - replace shortcut with something more recent (probably)
//  - wire in Esc for modals
//  - go through code adding errors and warnings wherever possible
//  - look at other UI things to add
//      - list issues
//      - lint: validator, link checker, check WebIDL, ID references
//      - save to GitHub
//  - once we have something decent, merge, ship as 3.2.0

define(
    ["jquery"],
    function ($) {
        var $menu = $("<div></div>")
                        .css({
                            background:     "#fff"
                        ,   border:         "1px solid #000"
                        ,   width:          "200px"
                        ,   display:        "none"
                        ,   textAlign:      "left"
                        ,   marginTop:      "5px"
                        ,   marginRight:    "5px"
                        })
                        ;
        var $modal
        ,   errors = []
        ,   warnings = []
        ,   buttons = {}
        ,   $respecButton
        ,   errWarn = function (msg, arr, butName, bg, title) {
                arr.push(msg);
                if (!buttons[butName]) {
                    buttons[butName] = $("<button></button>")
                                            .css({
                                                background:     bg
                                            ,   color:          "#fff"
                                            ,   fontWeight:     "bold"
                                            ,   border:         "none"
                                            ,   borderRadius:   "5px"
                                            ,   marginLeft:     "5px"
                                            })
                                            .insertAfter($respecButton)
                                            .click(function () {
                                                var $ul = $("<ol></ol>");
                                                for (var i = 0, n = arr.length; i < n; i++) {
                                                    var err = arr[i];
                                                    $("<li></li>").text(err).appendTo($ul);
                                                }
                                                ui.freshModal(title, $ul);
                                            })
                                            ;
                }
                buttons[butName].text(arr.length);
            }
        ;
        var ui = {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "core/ui");
                var $div = $("<div id='respec-ui' class='removeOnSave'></div>", doc)
                                .css({
                                    position:   "fixed"
                                ,   top:        "20px"
                                ,   right:      "20px"
                                ,   width:      "202px"
                                ,   textAlign:  "right"
                                })
                                .appendTo($("body", doc))
                                ;
                $respecButton = $("<button>ReSpec</button>")
                                    .css({
                                        background:     "#fff"
                                    ,   fontWeight:     "bold"
                                    ,   border:         "1px solid #ccc"
                                    ,   borderRadius:   "5px"
                                    })
                                    .click(function () {
                                        $menu.toggle();
                                    })
                                    .appendTo($div)
                                    ;
                $menu.appendTo($div);
                msg.pub("end", "core/ui");
                cb();
            }
        ,   addCommand: function (label, module) {
                $("<button></button>")
                    .css({
                        background:     "#fff"
                    ,   border:         "none"
                    ,   borderBottom:   "1px solid #ccc"
                    ,   width:          "100%"
                    ,   textAlign:      "left"
                    })
                    .text(label)
                    .click(function () {
                        $menu.hide();
                        require([module], function (mod) {
                            mod.show(ui);
                        });
                    })
                    .appendTo($menu)
                    ;
            }
        ,   error:  function (msg) {
                errWarn(msg, errors, "error", "#c00", "Errors");
            }
        ,   warning:  function (msg) {
                errWarn(msg, warnings, "warning", "#f60", "Warnings");
            }
        ,   freshModal: function (title, content) {
                if ($modal) $modal.remove();
                var width = 500
                ,   $overlay = $("<div id='respec-overlay' class='removeOnSave'></div>").hide()
                ,   $modal = $("<div id='respec-modal' class='removeOnSave'><h3></h3><div class='content'></div></div>").hide()
                ,   close = function () {
                        $overlay.fadeOut(200, function () { $overlay.remove(); });
                        $modal.remove();
                        $modal = null;
                    }
                ;
                $modal.find("h3").text(title);
                $modal.find(".content").append(content);
                $("body")
                    .append($overlay)
                    .append($modal);
                $overlay
                    .click(close)
                    .css({
                        display:    "block"
                    ,   opacity:    0
                    ,   position:   "fixed"
                    ,   zIndex:     10000
                    ,   top:        "0px"
                    ,   left:       "0px"
                    ,   height:     "100%"
                    ,   width:      "100%"
                    ,   background: "#000"
                    })
                    .fadeTo(200, 0.5)
                    ;
                $modal
                    .css({
                        display:        "block"
                    ,   position:       "fixed"
                    ,   opacity:        0
                    ,   zIndex:         11000
                    ,   left:           "50%"
                    ,   marginLeft:     -(width/2) + "px"
                    ,   top:            "100px"
                    ,   background:     "#fff"
                    ,   border:         "5px solid #666"
                    ,   borderRadius:   "5px"
                    ,   width:          width + "px"
                    ,   padding:        "0 20px 20px 20px"
                    })
                    .fadeTo(200, 1)
                    ;
            }
        };
        if (window.respecEvents) respecEvents.sub("error", function (details) {
            ui.error(details);
        });
        if (window.respecEvents) respecEvents.sub("warn", function (details) {
            ui.warning(details);
        });
        return ui;
    }
);
