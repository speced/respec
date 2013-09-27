
// Module core/ui
// Handles the ReSpec UI


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
                $("<button>ReSpec</button>")
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
                errors.push(msg);
                // add a pill if it's not there
                // increment its counter
                // clicking the pill shows the modal with list of errors
            }
        ,   warning:  function (msg) {
                warnings.push(msg);
                // same as above
            }
        ,   freshModal: function (title, content) {
                if ($modal) $modal.remove();
                var width = 500
                ,   $overlay = $("<div id='respec-overlay' class='removeOnSave'></div>").hide()
                ,   $modal = $("<div id='respec-modal' class='removeOnSave'><h3></h3><div class='content'></div></div>").hide()
                ,   close = function () {
                        $overlay.fadeOut(200);
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
        return ui;
    }
);
