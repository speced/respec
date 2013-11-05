/*global respecEvents */

// Module core/ui
// Handles the ReSpec UI

// XXX TODO
//  - look at other UI things to add
//      - list issues
//      - lint: validator, link checker, check WebIDL, ID references
//      - save to GitHub
//  - make a release candidate that people can test
//  - once we have something decent, merge, ship as 3.2.0

define(
    ["jquery", "shortcut"],
    function ($, shortcut) {
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
        ,   $overlay
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
                                                    if (err instanceof Error) {
                                                        $("<li><span></span> <a>\u229e</a><pre></pre></li>")
                                                            .appendTo($ul)
                                                            .find("span")
                                                                .text("[" + err.name + "] " + err.message)
                                                            .end()
                                                            .find("a")
                                                                .css({
                                                                    fontSize:   "1.1em"
                                                                ,   color:      "#999"
                                                                ,   cursor:     "pointer"
                                                                })
                                                                .click(function () {
                                                                    var $a = $(this)
                                                                    ,   state = $a.text()
                                                                    ,   $pre = $a.parent().find("pre");
                                                                    if (state === "\u229e") {
                                                                        $a.text("\u229f");
                                                                        $pre.show();
                                                                    }
                                                                    else {
                                                                        $a.text("\u229e");
                                                                        $pre.hide();
                                                                    }
                                                                })
                                                            .end()
                                                            .find("pre")
                                                                .text(err.stack)
                                                                .css({
                                                                    marginLeft: "0"
                                                                ,   maxWidth:   "100%"
                                                                ,   overflowY:  "hidden"
                                                                ,   overflowX:  "scroll"
                                                                })
                                                                .hide()
                                                            .end();
                                                    }
                                                    else {
                                                        $("<li></li>").text(err).appendTo($ul);
                                                    }
                                                }
                                                ui.freshModal(title, $ul);
                                            })
                                            ;
                }
                buttons[butName].text(arr.length);
            }
        ;
        var conf, doc, msg;
        var ui = {
            run:    function (_conf, _doc, cb, _msg) {
                conf = _conf, doc = _doc, msg = _msg;
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
                shortcut.add("Esc", function () {
                    ui.closeModal();
                });
                shortcut.add("Ctrl+Alt+Shift+E", function () {
                    if (buttons.error) buttons.error.click();
                });
                shortcut.add("Ctrl+Alt+Shift+W", function () {
                    if (buttons.warning) buttons.warning.click();
                });
                msg.pub("end", "core/ui");
                cb();
            }
        ,   addCommand: function (label, module, keyShort) {
                var handler = function () {
                    $menu.hide();
                    require([module], function (mod) {
                        mod.show(ui, conf, doc, msg);
                    });
                };
                $("<button></button>")
                    .css({
                        background:     "#fff"
                    ,   border:         "none"
                    ,   borderBottom:   "1px solid #ccc"
                    ,   width:          "100%"
                    ,   textAlign:      "left"
                    ,   fontSize:       "inherit"
                    })
                    .text(label)
                    .click(handler)
                    .appendTo($menu)
                    ;
                    if (keyShort) shortcut.add(keyShort, handler);
            }
        ,   error:  function (msg) {
                errWarn(msg, errors, "error", "#c00", "Errors");
            }
        ,   warning:  function (msg) {
                errWarn(msg, warnings, "warning", "#f60", "Warnings");
            }
        ,   closeModal: function () {
                if ($overlay) $overlay.fadeOut(200, function () { $overlay.remove(); $overlay = null; });
                if (!$modal) return;
                $modal.remove();
                $modal = null;
            }
        ,   freshModal: function (title, content) {
                if ($modal) $modal.remove();
                if ($overlay) $overlay.remove();
                var width = 500;
                $overlay = $("<div id='respec-overlay' class='removeOnSave'></div>").hide();
                $modal = $("<div id='respec-modal' class='removeOnSave'><h3></h3><div class='inside'></div></div>").hide();
                $modal.find("h3").text(title);
                $modal.find(".inside").append(content);
                $("body")
                    .append($overlay)
                    .append($modal);
                $overlay
                    .click(this.closeModal)
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
                    ,   maxHeight:      ($(window).height() - 150) + "px"
                    ,   overflowY:      "auto"
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
