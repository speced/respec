
// Module core/remove-respec
// Removes all ReSpec artefacts right before processing ends

define(
    ["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb) {
                // it is likely that some asynch operations won't have completed at that moment
                // if they happen to need the artefacts, we could change this to be hooked into
                // the base-runner to run right before end-all
                utils.removeReSpec(doc);
                cb();
            }
        };
    }
);
