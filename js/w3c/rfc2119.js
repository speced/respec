// Module w3c/rfc2119
// update the 2119 terms section with the terms actually used

define(
    ["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "w3c/rfc2119");
                var $confo = $("#respecRFC2119");
                if ($confo.length) {
                    // do we have a list of used RFC2119 items in
                    // conf.respecRFC2119
                    var used = Object.getOwnPropertyNames(conf.respecRFC2119).sort() ;
                    if (used && used.length) {
                        // put in the 2119 clause and reference
                        var str = "The " ;
                        var mapper = function(item) {
                            var ret = "<em class='rfc2119' title='"+item+"'>"+item+"</em>" ;
                            return ret;
                        };

                        if (used.length > 1) {
                            str += "key words " + utils.joinAnd(used, mapper) + " are ";
                        } 
                        else {
                            str += "key word " + utils.joinAnd(used, mapper) + " is " ;
                        }
                        str += $confo[0].innerHTML ;
                        $confo[0].innerHTML = str ;
                    }
                    else {
                        // there are no terms used - remove the
                        // clause
                        $confo.remove() ;
                    }
                }
                msg.pub("end", "w3c/rfc2119");
                cb();
            }
        };
    }
);
